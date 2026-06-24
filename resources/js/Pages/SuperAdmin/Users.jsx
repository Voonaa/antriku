import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Users({ users, tenants }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedUser, setSelectedUser] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'admin-instansi',
        tenant_id: ''
    });

    const openAddModal = () => {
        setModalMode('add');
        setSelectedUser(null);
        reset();
        clearErrors();
        if (tenants.length > 0) setData('tenant_id', tenants[0].id);
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setModalMode('edit');
        setSelectedUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            tenant_id: user.tenant_id || ''
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            post(route('super-admin.users.store'), {
                onSuccess: () => closeModal(),
            });
        } else {
            put(route('super-admin.users.update', selectedUser.id), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (user) => {
        if (confirm(`Apakah Anda yakin ingin menghapus akun ${user.name}?`)) {
            destroy(route('super-admin.users.destroy', user.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Akun" />

            <div className="py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Manajemen Akun</h2>
                        <p className="text-slate-500 text-sm mt-1">Kelola semua akun pengguna di sistem Antriku.</p>
                    </div>
                    <PrimaryButton onClick={openAddModal}>
                        + Tambah Akun
                    </PrimaryButton>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                                    <th className="p-4 font-semibold">Nama</th>
                                    <th className="p-4 font-semibold">Email</th>
                                    <th className="p-4 font-semibold">Role</th>
                                    <th className="p-4 font-semibold">Instansi</th>
                                    <th className="p-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">{user.name}</div>
                                        </td>
                                        <td className="p-4 text-slate-600">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                user.role === 'super-admin' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'admin-instansi' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600">
                                            {user.tenant ? user.tenant.nama_instansi : '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => openEditModal(user)}
                                                className="text-primary hover:text-teal-700 font-medium mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user)}
                                                className="text-red-500 hover:text-red-700 font-medium"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-500">
                                            Belum ada data akun.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">
                        {modalMode === 'add' ? 'Tambah Akun Baru' : 'Edit Akun'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Nama Lengkap" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value={modalMode === 'add' ? 'Password' : 'Password Baru (Kosongkan jika tidak ingin diubah)'} />
                            <TextInput
                                id="password"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required={modalMode === 'add'}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="role" value="Role Akses" />
                            <select
                                id="role"
                                className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                required
                            >
                                <option value="super-admin">Super Admin (Akses Penuh)</option>
                                <option value="admin-instansi">Admin Instansi (Kelola Loket & Petugas)</option>
                                <option value="petugas">Petugas (Panggil Antrian)</option>
                            </select>
                            <InputError message={errors.role} className="mt-2" />
                        </div>

                        {data.role !== 'super-admin' && (
                            <div>
                                <InputLabel htmlFor="tenant_id" value="Instansi (Tenant)" />
                                <select
                                    id="tenant_id"
                                    className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
                                    value={data.tenant_id}
                                    onChange={(e) => setData('tenant_id', e.target.value)}
                                    required={data.role !== 'super-admin'}
                                >
                                    <option value="">-- Pilih Instansi --</option>
                                    {tenants.map(tenant => (
                                        <option key={tenant.id} value={tenant.id}>{tenant.nama_instansi}</option>
                                    ))}
                                </select>
                                <InputError message={errors.tenant_id} className="mt-2" />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
