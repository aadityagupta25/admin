import React, { useState, useEffect } from 'react';
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash, Loader2, RefreshCw, Layers } from "lucide-react";
import { toast } from 'sonner';
import { batchLevelService } from '@/services';

const API_BASE = import.meta.env.VITE_API_BANNER_URL || import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://api.pololive.cloud';

const LEVEL_TYPES = ['recharge level', 'user lavel', 'party level'];
const BATCH_TYPES = ['recharge batch', 'user_batch'];

const defaultForm = { type: 'level', level_type: '', level: '', batch_type: '', batch: '', status: true };

const BatchLevels = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [addForm, setAddForm] = useState(defaultForm);
    const [addImage, setAddImage] = useState(null);
    const [editForm, setEditForm] = useState(defaultForm);
    const [editImage, setEditImage] = useState(null);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await batchLevelService.getAll();
            setData(res.data || []);
        } catch (err) {
            toast.error(err.message || 'Failed to load batch levels');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!addImage) { toast.error('Image is required'); return; }
        if ((addForm.type === 'level' || addForm.type === 'partylevel') && !addForm.level_type) { toast.error('Level Type is required'); return; }
        if (addForm.type === 'Batches' && !addForm.batch_type) { toast.error('Batch Type is required'); return; }
        try {
            setSubmitting(true);
            await batchLevelService.create({ ...addForm, img: addImage });
            toast.success('Batch level created successfully');
            setIsAddOpen(false);
            setAddForm(defaultForm);
            setAddImage(null);
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Failed to create batch level');
        } finally {
            setSubmitting(false);
        }
    };

    const openEdit = (item) => {
        setSelected(item);
        setEditForm({
            type: item.type,
            level_type: item.level_type || '',
            level: item.level || '',
            batch_type: item.batch_type || '',
            batch: item.batch || '',
            status: item.status,
        });
        setEditImage(null);
        setIsEditOpen(true);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if ((editForm.type === 'level' || editForm.type === 'partylevel') && !editForm.level_type) { toast.error('Level Type is required'); return; }
        if (editForm.type === 'Batches' && !editForm.batch_type) { toast.error('Batch Type is required'); return; }
        try {
            setSubmitting(true);
            const payload = { ...editForm };
            if (editImage) payload.img = editImage;
            await batchLevelService.update(selected.id, payload);
            toast.success('Batch level updated successfully');
            setIsEditOpen(false);
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Failed to update batch level');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            setSubmitting(true);
            await batchLevelService.delete(selected.id);
            toast.success('Batch level deleted successfully');
            setIsDeleteOpen(false);
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Failed to delete batch level');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (item) => {
        setData(prev => prev.map(r => r.id === item.id ? { ...r, status: !r.status } : r));
        try {
            await batchLevelService.toggleStatus(item.id);
            toast.success(`Status ${!item.status ? 'activated' : 'deactivated'}`);
        } catch (err) {
            setData(prev => prev.map(r => r.id === item.id ? { ...r, status: item.status } : r));
            toast.error(err.message || 'Failed to update status');
        }
    };

    const columns = [
        {
            id: 'sno',
            header: 'S.No',
            cell: ({ row }) => <div className="text-sm font-medium">{row.index + 1}</div>,
            enableSorting: false,
        },
        {
            accessorKey: 'img',
            header: 'Image',
            cell: ({ row }) => (
                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    <img
                        src={`${API_BASE}${row.original.img}`}
                        alt="batch level"
                        className="w-full h-full object-contain p-0.5"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }}
                    />
                </div>
            ),
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => {
                const type = row.original.type;
                const colorMap = {
                    level: 'bg-blue-100 text-blue-700',
                    Batches: 'bg-purple-100 text-purple-700',
                    partylevel: 'bg-orange-100 text-orange-700',
                };
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorMap[type] || 'bg-gray-100 text-gray-700'}`}>
                        {type}
                    </span>
                );
            },
        },
        {
            accessorKey: 'level_type',
            header: 'Level Type',
            cell: ({ row }) => <div className="text-sm">{row.original.level_type || '—'}</div>,
        },
        {
            accessorKey: 'level',
            header: 'Level',
            cell: ({ row }) => <div className="text-sm font-medium">{row.original.level || '—'}</div>,
        },
        {
            accessorKey: 'batch_type',
            header: 'Batch Type',
            cell: ({ row }) => <div className="text-sm">{row.original.batch_type || '—'}</div>,
        },
        {
            accessorKey: 'batch',
            header: 'Batch',
            cell: ({ row }) => <div className="text-sm font-medium">{row.original.batch || '—'}</div>,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const item = row.original;
                const isActive = item.status === true || item.status === 1;
                return (
                    <button
                        onClick={() => handleToggleStatus(item)}
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
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(item)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => { setSelected(item); setIsDeleteOpen(true); }}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Batch Levels</h2>
                    <p className="text-muted-foreground">Manage batch and level master data</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchData} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={() => { setAddForm(defaultForm); setAddImage(null); setIsAddOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" /> Add Batch Level
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <DataTable columns={columns} data={data} searchKey="type" />
            )}

            {/* Add Dialog */}
            <Dialog open={isAddOpen} onOpenChange={(v) => { setIsAddOpen(v); if (!v) { setAddForm(defaultForm); setAddImage(null); } }}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Create Batch Level</DialogTitle>
                        <DialogDescription>Add a new batch or level entry.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdd}>
                        <div className="grid gap-4 py-4">
                            <BatchLevelFormFields form={addForm} setForm={setAddForm} image={addImage} setImage={setAddImage} existingImg={null} isAdd />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={submitting}>Cancel</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={(v) => { setIsEditOpen(v); if (!v) setEditImage(null); }}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Edit Batch Level</DialogTitle>
                        <DialogDescription>Update batch level details.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit}>
                        <div className="grid gap-4 py-4">
                            <BatchLevelFormFields
                                form={editForm}
                                setForm={setEditForm}
                                image={editImage}
                                setImage={setEditImage}
                                existingImg={selected?.img ? `${API_BASE}${selected.img}` : null}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={submitting}>Cancel</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this batch level?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently remove this entry from the platform.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={submitting} className="bg-destructive hover:bg-destructive/90">
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

const BatchLevelFormFields = ({ form, setForm, image, setImage, existingImg, isAdd }) => {
    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    return (
        <>
            {/* Type */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <div className="col-span-3">
                    <Select value={form.type} onValueChange={(v) => set('type', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="level">Level</SelectItem>
                            <SelectItem value="Batches">Batches</SelectItem>
                            <SelectItem value="partylevel">Party Level</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Level / PartyLevel fields */}
            {(form.type === 'level' || form.type === 'partylevel') && (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Level Type</Label>
                        <div className="col-span-3">
                            <Select value={form.level_type} onValueChange={(v) => set('level_type', v)}>
                                <SelectTrigger><SelectValue placeholder="Select level type" /></SelectTrigger>
                                <SelectContent>
                                    {form.type === 'partylevel'
                                        ? <SelectItem value="party level">party level</SelectItem>
                                        : LEVEL_TYPES.filter(t => t !== 'party level').map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Level</Label>
                        <Input className="col-span-3" placeholder="e.g. 12" value={form.level} onChange={(e) => set('level', e.target.value)} required />
                    </div>
                </>
            )}

            {/* Batch fields */}
            {form.type === 'Batches' && (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Batch Type</Label>
                        <div className="col-span-3">
                            <Select value={form.batch_type} onValueChange={(v) => set('batch_type', v)}>
                                <SelectTrigger><SelectValue placeholder="Select batch type" /></SelectTrigger>
                                <SelectContent>
                                    {BATCH_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Batch</Label>
                        <Input className="col-span-3" placeholder="e.g. VIP" value={form.batch} onChange={(e) => set('batch', e.target.value)} required />
                    </div>
                </>
            )}

            {/* Image */}
            <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Image</Label>
                <div className="col-span-3 space-y-2">
                    {(image || existingImg) && (
                        <div className="flex justify-center">
                            <div className="w-24 h-24 rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                                <img
                                    src={image ? URL.createObjectURL(image) : existingImg}
                                    className="w-full h-full object-contain p-1"
                                    alt="preview"
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }}
                                />
                            </div>
                        </div>
                    )}
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        required={isAdd && !image}
                    />
                    {image && (
                        <button type="button" onClick={() => setImage(null)} className="text-xs text-destructive hover:underline">
                            {existingImg ? 'Revert to original' : 'Remove image'}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default BatchLevels;
