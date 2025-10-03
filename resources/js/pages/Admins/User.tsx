import { Head, } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Plus, Trash2, Lock, Unlock, Eye, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import AddNewAdmin from '@/components/Admin/AddAdmin';
import EditAdmin from '@/components/Admin/EditAdmin';
import { getFullName } from '@/lib/utils';
import Swal from 'sweetalert2';
import AddNewUser from '@/components/Admin/AddUser';
import Spinner from '@/components/spinner';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admins',
        href: '/admins',
    },
];


interface Props {
    users: User[];
    departments: {
        id: number;
        name: string;
        description: string;
        type: 'office' | 'college';
    }[];
    departmentsForUserCreation: {
        id: number;
        name: string;
        description: string;
        type: 'office' | 'college';
    }[];
    auth: {
        user: {
            id: number;
        };
    };
}

export default function Admins({ users, departments, auth, departmentsForUserCreation }: Props) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const { processing, delete: destroy, patch, data, setData, post, errors, reset, put } = useForm({
        first_name: '',
        last_name: '',
        middle_name: '',
        suffix: '',
        gender: '',
        position: '',
        department_id: '',
        email: '',
        role: 'admin',
    });

    const handleToggleStatus = (user: User) => {
        const action = user.is_active ? 'deactivate' : 'activate';
        Swal.fire({
            title: 'Are you sure?',
            text: `You won\'t be able to revert this!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                patch(route('admins.toggle-status', user.id), {
                    onSuccess: () => {
                        toast.success(`User ${action}d successfully`);
                    },
                    onError: (errors: any) => {
                        toast.error(`Failed to ${action} user. Please try again.`);
                    }
                });
            }
        });
    };

    const handleDeleteAdmin = (user: User) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('admins.destroy', user.id), {
                    onSuccess: () => {
                        toast.success('User deleted successfully');
                    },
                    onError: (errors: any) => {
                        toast.error('Failed to delete user. Please try again.');
                    }
                });
            }
        });
    };

    const handleViewAdmin = (user: User) => {
        setSelectedAdmin(user);
        setIsViewDialogOpen(true);
    };

    const handleEditAdmin = (user: User) => {
        setSelectedAdmin(user);
        // Initialize form data with the selected admin's data
        setData('first_name', user.first_name);
        setData('last_name', user.last_name);
        setData('middle_name', user.middle_name || '');
        setData('suffix', user.suffix || '');
        setData('gender', user.gender);
        setData('position', user.position);
        setData('department_id', user.department?.id?.toString() || '');
        setData('email', user.email);
        setData('role', user.role);
        setIsEditDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {processing && <Spinner />}
            <Head title="Admin Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex gap-6 overflow-auto items-center w-full">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                            <p className="text-muted-foreground">
                                Manage all users
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                        <p className="text-sm font-semibold dark:text-white">Search:</p>
                        <Input type="text" placeholder="Search User" onChange={(e) => setFilter(e.target.value)} value={filter} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Admin
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Admin</DialogTitle>
                                </DialogHeader>
                                <AddNewAdmin
                                    setIsCreateDialogOpen={setIsCreateDialogOpen}
                                    departments={departments}
                                    processing={processing}
                                    post={post}
                                    setData={setData}
                                    data={data}
                                    errors={errors}
                                    reset={reset}
                                />
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create User
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New User</DialogTitle>
                                </DialogHeader>
                                <AddNewUser
                                    setIsCreateDialogOpen={setIsCreateUserDialogOpen}
                                    departments={departmentsForUserCreation}
                                    processing={processing}
                                    post={post}
                                    setData={setData}
                                    data={data}
                                    errors={errors}
                                    reset={reset}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>

                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.filter((user) =>
                                user.first_name.toLowerCase().includes(filter.toLowerCase()) ||
                                user.last_name.toLowerCase().includes(filter.toLowerCase()) ||
                                user.middle_name?.toLowerCase().includes(filter.toLowerCase()) ||
                                user.position.toLowerCase().includes(filter.toLowerCase()) ||
                                user.department?.name?.toLowerCase().includes(filter.toLowerCase()) ||
                                user.email.toLowerCase().includes(filter.toLowerCase())
                            ).map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{getFullName(user)}</TableCell>
                                    <TableCell>{user.position}</TableCell>
                                    <TableCell>{user.department?.name || 'N/A'}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="capitalize">{user.role}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleViewAdmin(user)}
                                                title="View Admin Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEditAdmin(user)}
                                                title="Edit Admin"
                                                disabled={user.id === auth.user.id}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleToggleStatus(user)}
                                                title={user.is_active ? 'Deactivate Admin' : 'Activate Admin'}
                                                disabled={!user.is_active && user.id === auth.user.id}
                                            >
                                                {user.is_active ? (
                                                    <Lock className="h-4 w-4" />
                                                ) : (
                                                    <Unlock className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteAdmin(user)}
                                                title="Delete Admin"
                                                disabled={user.id === auth.user.id}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Admin Details Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Admin Details</DialogTitle>
                        </DialogHeader>
                        {selectedAdmin && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>First Name</Label>
                                        <p className="text-sm">{selectedAdmin.first_name}</p>
                                    </div>
                                    <div>
                                        <Label>Last Name</Label>
                                        <p className="text-sm">{selectedAdmin.last_name}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Middle Name</Label>
                                        <p className="text-sm">{selectedAdmin.middle_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label>Suffix</Label>
                                        <p className="text-sm">{selectedAdmin.suffix || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Gender</Label>
                                        <p className="text-sm">{selectedAdmin.gender}</p>
                                    </div>
                                    <div>
                                        <Label>Status</Label>
                                        <p className="text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs ${selectedAdmin.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {selectedAdmin.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <Label>Department</Label>
                                    <p className="text-sm">{selectedAdmin.department?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label>Position</Label>
                                    <p className="text-sm">{selectedAdmin.position}</p>
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <p className="text-sm">{selectedAdmin.email}</p>
                                </div>
                                <div>
                                    <Label>Created At</Label>
                                    <p className="text-sm">{format(new Date(selectedAdmin.created_at), 'MMMM d, yyyy h:mm a')}</p>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Edit Admin Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Admin</DialogTitle>
                        </DialogHeader>
                        {selectedAdmin && (
                            <EditAdmin
                                admin={selectedAdmin}
                                departments={departments}
                                setIsEditDialogOpen={setIsEditDialogOpen}
                                processing={processing}
                                put={put}
                                setData={setData}
                                data={data}
                                errors={errors}
                                reset={reset}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
