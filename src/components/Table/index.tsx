import { useCallback, useEffect, useMemo } from "react";
import { PersonState, setData, setPersons } from "../../features/person/personSlice";
import { IPerson, Person } from "../../interfaces/Person";
import { PersonService } from "../../services/person.service";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";

export const Table = () => {
    const personList = useSelector((state: { person: PersonState }) => state.person.list);
    const dispatch = useDispatch();

    // Memorizar a instância de PersonService com useMemo
    const personService = useMemo(() => new PersonService(), []);

    // Função fetchData memorizada com useCallback
    const fetchData = useCallback(async () => {
        try {
            const res: IPerson[] = await personService.getAll();
            dispatch(setPersons(res));
        } catch (error) {
            console.log('Erro ao carregar ===>', error);
        }
    }, [dispatch, personService]); // Adicionamos personService como dependência

    // useEffect para carregar dados ao montar o componente
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onClickEdit = (item: IPerson) => {
        dispatch(setData(item));
    };

    const onClickDelete = (item: IPerson) => {
        Swal.fire({
            title: 'Tem certeza que quer deletar?',
            showCancelButton: true,
            confirmButtonText: 'Salvar',
        }).then((result) => {
            if (result.isConfirmed) {
                fetchDelete(item);
            }
        });
    };

    const fetchDelete = async (item: IPerson) => {
        try {
            await personService.delete(item);

            Swal.fire({
                icon: 'success',
                title: 'O item foi deletado',
                showConfirmButton: false,
            });

            fetchData(); // Recarrega os dados após deletar
        } catch (error) {
            console.log('Erro ao carregar ===>', error);
        }
    };

    const onClickInfo = async (item: IPerson) => {
        try {
            const data: IPerson = await personService.getById(item.id!);

            Swal.fire({
                icon: 'info',
                title: 'Detalhes',
                html:
                    `<b>Nome</b> : ${data.name} <br>` +
                    `<b>Endereço</b> : ${data.address} <br>` +
                    `<b>Telefone</b> : ${data.phone} <br>`,
                showCloseButton: false,
                showCancelButton: false,
                confirmButtonText: 'Ok',
            });
        } catch (error) {
            console.log('Erro ===>', error);
        }
    };

    return (
        <div className="inline-block">
            <button
                className="bg-teal-600 text-gray-50 font-semibold py-2 px-4 rounded-lg"
                onClick={() => dispatch(setData(new Person()))}
            >
                Novo
            </button>
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-slate-800">
                        <tr>
                            <th scope="col" className="px-12 py-3.5 text-slate-50 font-medium text-left">
                                Nome
                            </th>
                            <th scope="col" className="px-12 py-3.5 text-slate-50 font-medium text-left">
                                Endereço
                            </th>
                            <th scope="col" className="px-12 py-3.5 text-slate-50 font-medium text-left">
                                Telefone
                            </th>
                            <th scope="col" className="px-12 py-3.5 text-slate-50 font-medium text-left">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {personList.map((item: IPerson, i: number) => (
                            <tr key={i}>
                                <td className="px-12 py-4 whitespace-nowrap">{item.name}</td>
                                <td className="px-12 py-4 whitespace-nowrap">{item.address}</td>
                                <td className="px-12 py-4 whitespace-nowrap">{item.phone}</td>
                                <td className="px-12 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-x-6">
                                        <button
                                            className="bg-sky-600 text-sky-50 font-semibold py-2 px-4 rounded-lg"
                                            onClick={() => onClickInfo(item)}
                                        >
                                            Info
                                        </button>
                                        <button
                                            className="bg-gray-600 text-sky-50 font-semibold py-2 px-4 rounded-lg"
                                            onClick={() => onClickEdit(item)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-600 text-sky-50 font-semibold py-2 px-4 rounded-lg"
                                            onClick={() => onClickDelete(item)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
