import Swal from 'sweetalert2';
import { PersonState, setData, setPersons } from '../../features/person/personSlice';
import { IPerson, Person } from '../../interfaces/Person';
import { PersonService } from '../../services/person.service';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

export const Form = () => {
    const personData = useSelector((state: { person: PersonState }) => state.person.data);
    const personList = useSelector((state: { person: PersonState }) => state.person.list);

    const [errorForm, setErrorForm] = useState({
        name: false,
        address: false,
        phone: false,
    });

    const dispatch = useDispatch();
    const personService = new PersonService();

    const isValidForm = () => {
        const error = { name: false, address: false, phone: false };

        if (!personData.name) error.name = true;
        if (!personData.address) error.address = true;
        if (!personData.phone) error.phone = true;

        setErrorForm(error);
        return error.name || error.address || error.phone;
    };

    const setFormValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setData({ ...personData, [event.target.id]: event.target.value }));
    };

    const fetchUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const data: IPerson = await personService.put(personData.id!, {
                name: personData.name,
                address: personData.address,
                phone: parseInt(personData.phone.toString()),
            });

            const updatedList = [...personList];
            const index = updatedList.findIndex((item) => item.id === data.id);
            updatedList.splice(index, 1, data);

            dispatch(setPersons(updatedList));
            dispatch(setData(new Person()));

            Swal.fire({
                icon: 'success',
                title: 'O item foi atualizado',
            });
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isValidForm()) return;

        try {
            const data: IPerson = await personService.post({
                name: personData.name,
                address: personData.address,
                phone: parseInt(personData.phone.toString()),
            });

            dispatch(setData(new Person()));
            dispatch(setPersons([...personList, data]));

            Swal.fire({
                icon: 'success',
                title: 'O item foi adicionado',
            });
        } catch (error) {
            console.log(error);
        }
    };

    const inputCSS =
        'block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40';
    const inputError = ' border-red-400';

    return (
        <div className="px-8 py-4 pb-8 rounded-lg bg-gray-50">
            <form onSubmit={(e) => (personData.id ? fetchUpdate(e) : fetchCreate(e))}>
                <div className="mt-4">
                    <label className="mb-2 text-gray-800">Nome</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Nome Sobrenome"
                        value={personData.name}
                        onChange={setFormValue}
                        className={errorForm.name ? inputCSS + inputError : inputCSS}
                    />
                    {errorForm.name && <p className="mt-1 text-m text-red-400">Campo obrigatório</p>}
                </div>
                <div className="mt-4">
                    <label className="mb-2 text-gray-800">Endereço</label>
                    <input
                        id="address"
                        type="text"
                        placeholder="Rua dos Patos, 123"
                        value={personData.address}
                        onChange={setFormValue}
                        className={errorForm.address ? inputCSS + inputError : inputCSS}
                    />
                    {errorForm.address && <p className="mt-1 text-m text-red-400">Campo obrigatório</p>}
                </div>
                <div className="mt-4">
                    <label className="mb-2 text-gray-800">Telefone</label>
                    <input
                        id="phone"
                        type="text"
                        placeholder="11912345678"
                        value={personData.phone}
                        onChange={setFormValue}
                        className={errorForm.phone ? inputCSS + inputError : inputCSS}
                    />
                    {errorForm.phone && <p className="mt-1 text-m text-red-400">Campo obrigatório</p>}
                </div>
                <button className="w-full mt-8 bg-teal-600 text-gray-50 font-semibold py-2 px-4 rounded-lg">
                    {personData.id ? 'Save' : 'Create'}
                </button>
            </form>
        </div>
    );
};
