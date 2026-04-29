import React, { useState, useEffect } from 'react';
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Plus, Pencil, Trash, Loader2, History } from "lucide-react";
import { toast } from 'sonner';
import { userService } from '@/services/userService';
import { getFullImageUrl } from '@/lib/utils';

const Users = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [data, setData] = useState([]);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isTxOpen, setIsTxOpen] = useState(false);
    const [txUser, setTxUser] = useState(null);
    const [txHistory, setTxHistory] = useState([]);
    const [txLoading, setTxLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        mobile_number: '',
        email: '',
        gender: '',
        country: '',
        language: '',
        dob: '',
        profile_img: null,
        bg_img: null
    });

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            console.log('[Users Page] Fetching users...');
            setIsLoading(true);
            const response = await userService.getAll();
            console.log('[Users Page] Response received:', response);
            if (response.success) {
                setData(response.data);
                toast.success(`Loaded ${response.count} users`);
            } else {
                console.warn('[Users Page] Response missing success flag:', response);
                setData([]);
            }
        } catch (error) {
            console.error('[Users Page] Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.mobile_number || !formData.email) {
            toast.error('Mobile number and email are required');
            return;
        }

        try {
            setIsSaving(true);
            const response = await userService.create(formData);
            
            if (response.success) {
                toast.success(response.message || "User created successfully");
                setIsAddOpen(false);
                resetForm();
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error(error.message || 'Failed to create user');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.mobile_number || !formData.email) {
            toast.error('Mobile number and email are required');
            return;
        }

        try {
            setIsSaving(true);
            const response = await userService.update(selectedUser.id, formData);
            
            if (response.success) {
                toast.success(response.message || "User updated successfully");
                setIsEditOpen(false);
                resetForm();
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error(error.message || 'Failed to update user');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await userService.delete(selectedUser.id);
            setData(data.filter(item => item.id !== selectedUser.id));
            setIsDeleteOpen(false);
            toast.success("User deleted successfully");
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        }
    };

    const openEditDialog = (user) => {
        setSelectedUser(user);
        setFormData({
            full_name: user.full_name || '',
            mobile_number: user.mobile_number || '',
            email: user.email || '',
            gender: user.gender || '',
            country: user.country || '',
            language: user.language || '',
            dob: user.dob ? user.dob.split('T')[0] : '',
            profile_img: null,
            bg_img: null
        });
        setIsEditOpen(true);
    };

    const resetForm = () => {
        setFormData({
            full_name: '',
            mobile_number: '',
            email: '',
            gender: '',
            country: '',
            language: '',
            dob: '',
            profile_img: null,
            bg_img: null
        });
        setSelectedUser(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        }
    };

    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 1 ? 0 : 1;
        // Optimistic update
        setData(prev => prev.map(item => item.id === user.id ? { ...item, status: newStatus } : item));
        try {
            await userService.toggleStatus(user.id, newStatus);
            toast.success(`User ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            // Revert on failure
            setData(prev => prev.map(item => item.id === user.id ? { ...item, status: user.status } : item));
            console.error('Error updating user status:', error);
            toast.error('Failed to update user status');
        }
    };

    const openTxHistory = async (user) => {
        setTxUser(user);
        setTxHistory([]);
        setIsTxOpen(true);
        setTxLoading(true);
        try {
            const res = await userService.getWalletHistory(user.user_id);
            setTxHistory(res.data?.history || []);
        } catch {
            toast.error('Failed to load transaction history');
        } finally {
            setTxLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const columns = [
        {
            id: "sno",
            header: "S.No",
            cell: ({ row }) => (
                <div className="text-sm font-medium">{row.index + 1}</div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "user_id",
            header: "User ID",
            cell: ({ row }) => (
                <div className="font-mono text-sm">{row.original.user_id}</div>
            ),
        },
        {
            accessorKey: "full_name",
            header: "User",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage 
                            src={getFullImageUrl(row.original.profile_img)} 
                            alt={row.original.full_name} 
                        />
                        <AvatarFallback>{getInitials(row.original.full_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{row.original.full_name}</div>
                        <div className="text-sm text-muted-foreground">@{row.original.user_name}</div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "mobile_number",
            header: "Mobile",
            cell: ({ row }) => (
                <div className="font-mono text-sm">{row.original.mobile_number}</div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <div className="text-sm">{row.original.email || '-'}</div>
            ),
        },
        {
            accessorKey: "gender",
            header: "Gender",
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.gender ? row.original.gender.charAt(0).toUpperCase() + row.original.gender.slice(1) : '-'}
                </Badge>
            ),
        },
        {
            accessorKey: "country",
            header: "Country",
            cell: ({ row }) => (
                <div className="text-sm">{row.original.country || '-'}</div>
            ),
        },
        {
            accessorKey: "language",
            header: "Language",
            cell: ({ row }) => (
                <div className="text-sm">{row.original.language || '-'}</div>
            ),
        },
        {
            accessorKey: "wallet",
            header: "Wallet Balance",
            cell: ({ row }) => (
                <div className="text-sm font-medium">
                    {row.original.wallet?.balance || 0} {row.original.wallet?.currency || 'USD'}
                </div>
            ),
        },
        {
            id: "tx_history",
            header: "Transaction History",
            cell: ({ row }) => (
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => openTxHistory(row.original)}
                >
                    <History className="h-3 w-3" />
                    History
                </Button>
            ),
        },
        {
            accessorKey: "followers_id",
            header: "Followers",
            cell: ({ row }) => (
                <div className="text-sm text-center">
                    {Array.isArray(row.original.followers_id) ? row.original.followers_id.length : 0}
                </div>
            ),
        },
        {
            accessorKey: "following_id",
            header: "Following",
            cell: ({ row }) => (
                <div className="text-sm text-center">
                    {Array.isArray(row.original.following_id) ? row.original.following_id.length : 0}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const user = row.original;
                const isActive = user.status === 1 || user.status === true;
                return (
                    <button
                        onClick={() => handleToggleStatus(user)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold cursor-pointer border transition-colors ${
                            isActive
                                ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                                : 'bg-red-100 text-red-600 border-red-300 hover:bg-red-200'
                        }`}
                    >
                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                        {isActive ? 'Active' : 'Inactive'}
                    </button>
                );
            },
        },
        {
            accessorKey: "created_at_ist",
            header: "Joined",
            cell: ({ row }) => (
                <div className="text-sm whitespace-nowrap">{row.original.created_at_ist}</div>
            ),
        },
        {
            accessorKey: "updated_at_ist",
            header: "Last Updated",
            cell: ({ row }) => (
                <div className="text-sm whitespace-nowrap">{row.original.updated_at_ist}</div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedUser(user);
                                    setIsDeleteOpen(true);
                                }}
                                className="text-destructive"
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
                    <p className="text-muted-foreground">
                        Manage all users in your application
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchUsers}>
                        Refresh
                    </Button>
                    <Button onClick={() => {
                        resetForm();
                        setIsAddOpen(true);
                    }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={data}
                searchKey="full_name"
                searchPlaceholder="Search users..."
            />

            {/* Transaction History Dialog */}
            <Dialog open={isTxOpen} onOpenChange={setIsTxOpen}>
                <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Transaction History</DialogTitle>
                        <DialogDescription>
                            Wallet history for {txUser?.full_name} ({txUser?.user_id})
                        </DialogDescription>
                    </DialogHeader>
                    {txLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left px-3 py-2 font-medium">#</th>
                                        <th className="text-left px-3 py-2 font-medium">Summary</th>
                                        <th className="text-left px-3 py-2 font-medium">Type</th>
                                        <th className="text-right px-3 py-2 font-medium">Amount</th>
                                        <th className="text-right px-3 py-2 font-medium">Balance Before</th>
                                        <th className="text-right px-3 py-2 font-medium">Balance After</th>
                                        <th className="text-left px-3 py-2 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {txHistory.length === 0 ? (
                                        <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No transactions found</td></tr>
                                    ) : txHistory.map((tx, i) => (
                                        <tr key={tx.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                                            <td className="px-3 py-2 capitalize">{tx.summary}</td>
                                            <td className="px-3 py-2">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                    tx.transaction_type === 'credit'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-600'
                                                }`}>
                                                    {tx.transaction_type}
                                                </span>
                                            </td>
                                            <td className={`px-3 py-2 text-right font-mono font-medium ${
                                                tx.transaction_type === 'credit' ? 'text-green-600' : 'text-red-500'
                                            }`}>
                                                {Number(tx.amount).toLocaleString()}
                                            </td>
                                            <td className="px-3 py-2 text-right font-mono text-muted-foreground">{Number(tx.balance_before).toLocaleString()}</td>
                                            <td className="px-3 py-2 text-right font-mono text-muted-foreground">{Number(tx.balance_after).toLocaleString()}</td>
                                            <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{tx.created_at_ist}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Add User Dialog */}
            <Dialog open={isAddOpen} onOpenChange={(open) => {
                setIsAddOpen(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Create a new user account. Mobile number and email are required.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mobile_number">
                                    Mobile Number <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="mobile_number"
                                    name="mobile_number"
                                    value={formData.mobile_number}
                                    onChange={handleInputChange}
                                    placeholder="Enter mobile number"
                                    required
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="email">
                                    Email <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    name="dob"
                                    type="date"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    placeholder="Enter country"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <Input
                                    id="language"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                    placeholder="Enter language"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="profile_img">Profile Image</Label>
                                <Input
                                    id="profile_img"
                                    name="profile_img"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bg_img">Background Image</Label>
                                <Input
                                    id="bg_img"
                                    name="bg_img"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsAddOpen(false);
                                    resetForm();
                                }}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSaving ? 'Creating...' : 'Create User'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditOpen} onOpenChange={(open) => {
                setIsEditOpen(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user information. Mobile number and email are required.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit_full_name">Full Name</Label>
                                <Input
                                    id="edit_full_name"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_mobile_number">
                                    Mobile Number <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="edit_mobile_number"
                                    name="mobile_number"
                                    value={formData.mobile_number}
                                    onChange={handleInputChange}
                                    placeholder="Enter mobile number"
                                    required
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="edit_email">
                                    Email <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="edit_email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_gender">Gender</Label>
                                <select
                                    id="edit_gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_dob">Date of Birth</Label>
                                <Input
                                    id="edit_dob"
                                    name="dob"
                                    type="date"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_country">Country</Label>
                                <Input
                                    id="edit_country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    placeholder="Enter country"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_language">Language</Label>
                                <Input
                                    id="edit_language"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                    placeholder="Enter language"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_profile_img">Profile Image</Label>
                                <Input
                                    id="edit_profile_img"
                                    name="profile_img"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {selectedUser?.profile_img && (
                                    <p className="text-xs text-muted-foreground">
                                        Current: {selectedUser.profile_img.split('/').pop()}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_bg_img">Background Image</Label>
                                <Input
                                    id="edit_bg_img"
                                    name="bg_img"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {selectedUser?.bg_img && (
                                    <p className="text-xs text-muted-foreground">
                                        Current: {selectedUser.bg_img.split('/').pop()}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditOpen(false);
                                    resetForm();
                                }}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSaving ? 'Updating...' : 'Update User'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View User Details Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                            Complete information about the user
                        </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-6">
                            {/* Profile Section */}
                            <div className="flex items-start gap-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage 
                                        src={getFullImageUrl(selectedUser.profile_img)} 
                                        alt={selectedUser.full_name} 
                                    />
                                    <AvatarFallback className="text-2xl">
                                        {getInitials(selectedUser.full_name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold">{selectedUser.full_name}</h3>
                                    <p className="text-muted-foreground">@{selectedUser.user_name}</p>
                                    <Badge className="mt-2" variant={selectedUser.status === 1 ? "default" : "secondary"}>
                                        {selectedUser.status === 1 ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">User ID</p>
                                    <p className="font-mono">{selectedUser.user_id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">ID</p>
                                    <p className="font-mono">{selectedUser.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Mobile</p>
                                    <p className="font-mono">{selectedUser.mobile_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p>{selectedUser.email || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Gender</p>
                                    <p>{selectedUser.gender ? selectedUser.gender.charAt(0).toUpperCase() + selectedUser.gender.slice(1) : '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">DOB</p>
                                    <p>{selectedUser.dob_ist || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Country</p>
                                    <p>{selectedUser.country || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Language</p>
                                    <p>{selectedUser.language || '-'}</p>
                                </div>
                            </div>

                            {/* Wallet Info */}
                            <div>
                                <h4 className="font-semibold mb-2">Wallet</h4>
                                <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Balance</p>
                                        <p className="text-lg font-bold">{selectedUser.wallet?.balance || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Currency</p>
                                        <p className="text-lg font-bold">{selectedUser.wallet?.currency || 'USD'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Info */}
                            <div>
                                <h4 className="font-semibold mb-2">Social</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Followers</p>
                                        <p className="text-lg font-bold">
                                            {Array.isArray(selectedUser.followers_id) ? selectedUser.followers_id.length : 0}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Following</p>
                                        <p className="text-lg font-bold">
                                            {Array.isArray(selectedUser.following_id) ? selectedUser.following_id.length : 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div>
                                <h4 className="font-semibold mb-2">Timestamps</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Created At</p>
                                        <p>{selectedUser.created_at_ist}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Updated At</p>
                                        <p>{selectedUser.updated_at_ist}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Background Image */}
                            {selectedUser.bg_img && (
                                <div>
                                    <h4 className="font-semibold mb-2">Background Image</h4>
                                    <img 
                                        src={getFullImageUrl(selectedUser.bg_img)} 
                                        alt="Background" 
                                        className="w-full rounded-lg border"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user
                            <span className="font-semibold"> {selectedUser?.full_name}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Users;
