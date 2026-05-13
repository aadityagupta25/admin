import React, { useState, useEffect } from 'react';
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash, Loader2, RefreshCw, ImageIcon } from "lucide-react";
import { toast } from 'sonner';
import { giftService } from '@/services/giftService';
import ImageCropper from '@/components/common/ImageCropper';

const BASE_URL = 'https://api.pololive.cloud';

const GiftCatalog = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [editForm, setEditForm] = useState({ category: 'Hot', cost: '' });

    const CATEGORIES = ['Hot', 'Lucky', 'Baggage', 'Atlas', 'Store'];
    const [addImage, setAddImage] = useState(null);
    const [editImage, setEditImage] = useState(null);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await giftService.getAll();
            setData(res.data || []);
        } catch (err) {
            toast.error('Failed to load gift catalog');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (!addImage) return toast.error('Icon image is required');
        try {
            setSubmitting(true);
            await giftService.create({
                category: formData.get('category'),
                cost: Number(formData.get('cost')),
                icon_image: addImage,
                status: 1,
            });
            toast.success('Gift item created successfully');
            setIsAddOpen(false);
            setAddImage(null);
            e.target.reset();
            fetchItems();
        } catch (err) {
            toast.error(err.message || 'Failed to create gift item');
        } finally {
            setSubmitting(false);
        }
    };

    const openEditDialog = (item) => {
        setSelected(item);
        setEditForm({ category: item.category || '', cost: item.cost ?? '' });
        setEditImage(null);
        setIsEditOpen(true);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const payload = {
                category: editForm.category,
                cost: Number(editForm.cost),
            };
            if (editImage) payload.icon_image = editImage;
            await giftService.update(selected.id, payload);
            toast.success('Gift item updated successfully');
            setIsEditOpen(false);
            fetchItems();
        } catch (err) {
            toast.error(err.message || 'Failed to update gift item');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            setSubmitting(true);
            await giftService.delete(selected.id);
            toast.success('Gift item deleted successfully');
            setIsDeleteOpen(false);
            fetchItems();
        } catch (err) {
            toast.error(err.message || 'Failed to delete gift item');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (item) => {
        const newStatus = item.status ? 0 : 1;
        setData(prev => prev.map(g => g.id === item.id ? { ...g, status: newStatus } : g));
        try {
            await giftService.update(item.id, { status: newStatus });
            toast.success(`Gift item ${newStatus ? 'activated' : 'deactivated'} successfully`);
        } catch (err) {
            setData(prev => prev.map(g => g.id === item.id ? { ...g, status: item.status } : g));
            toast.error(err.message || 'Failed to update status');
        }
    };

    const columns = [
        {
            id: "sno",
            header: "S.No",
            cell: ({ row }) => <div className="text-sm font-medium">{row.index + 1}</div>,
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "icon_image",
            header: "Icon",
            cell: ({ row }) => {
                const path = row.original.icon_image || '';
                const ext = path.split('.').pop().toLowerCase();
                const isRenderable = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext);
                if (!isRenderable) {
                    return (
                        <div
                            title={path.split('/').pop()}
                            style={{ width: 48, height: 48, borderRadius: 8, background: 'linear-gradient(135deg, #667eea22, #764ba222)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
                        >
                            <span style={{ fontSize: 20 }}>🎁</span>
                            <span style={{ fontSize: 8, color: '#9ca3af', fontFamily: 'monospace', letterSpacing: '-0.5px' }}>.svga</span>
                        </div>
                    );
                }
                return (
                    <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: '#f3f4f6', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
                        <img
                            src={`${BASE_URL}${path}`}
                            alt={row.original.category}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Gift'; }}
                        />
                    </div>
                );
            },
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => <div className="font-medium">{row.original.category}</div>,
        },
        {
            accessorKey: "cost",
            header: "Cost",
            cell: ({ row }) => <div className="font-mono text-sm">{row.original.cost}</div>,
        },
        {
            accessorKey: "status",
            header: "Status",
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
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => openEditDialog(item)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => { setSelected(item); setIsDeleteOpen(true); }}
                        >
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
                    <h2 className="text-3xl font-bold tracking-tight">Gift Catalog</h2>
                    <p className="text-muted-foreground">Manage gift catalog items</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchItems} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={() => setIsAddOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Gift Item
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <DataTable columns={columns} data={data} searchKey="category" />
            )}

            {/* Add Dialog */}
            <Dialog open={isAddOpen} onOpenChange={(v) => { setIsAddOpen(v); if (!v) setAddImage(null); }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Gift Item</DialogTitle>
                        <DialogDescription>Create a new gift catalog item.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdd}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">Category</Label>
                                <select name="category" defaultValue="Hot" className="col-span-3 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" required>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="cost" className="text-right">Cost</Label>
                                <Input id="cost" name="cost" type="number" min="0" placeholder="0" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Icon</Label>
                                <div className="col-span-3 space-y-2">
                                    <ImageCropper aspect={1} onCropped={(file) => setAddImage(file)}>
                                        <div className={`w-full h-32 rounded-md border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors overflow-hidden ${
                                            addImage ? 'border-primary' : 'border-muted-foreground/30 hover:border-primary'
                                        }`}>
                                            {addImage ? (
                                                <img src={URL.createObjectURL(addImage)} className="w-full h-full object-cover" alt="preview" />
                                            ) : (
                                                <>
                                                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">Click to select &amp; crop</span>
                                                </>
                                            )}
                                        </div>
                                    </ImageCropper>
                                    {addImage && (
                                        <button type="button" onClick={() => setAddImage(null)} className="text-xs text-destructive hover:underline">Remove image</button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => { setIsAddOpen(false); setAddImage(null); }} disabled={submitting}>Cancel</Button>
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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Gift Item</DialogTitle>
                        <DialogDescription>Update gift item details.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Category</Label>
                                <select
                                    value={editForm.category}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                                    className="col-span-3 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Cost</Label>
                                <Input
                                    type="number" min="0"
                                    value={editForm.cost}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, cost: e.target.value }))}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Icon</Label>
                                <div className="col-span-3 space-y-2">
                                    <ImageCropper aspect={1} onCropped={(file) => setEditImage(file)}>
                                        <div className="w-full h-32 rounded-md border-2 border-dashed border-muted-foreground/30 hover:border-primary overflow-hidden cursor-pointer relative group">
                                            <img
                                                src={editImage ? URL.createObjectURL(editImage) : `${BASE_URL}${selected?.icon_image}`}
                                                alt="icon"
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Gift'; }}
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-xs font-medium">Click to replace &amp; crop</span>
                                            </div>
                                        </div>
                                    </ImageCropper>
                                    {editImage && (
                                        <button type="button" onClick={() => setEditImage(null)} className="text-xs text-destructive hover:underline">Revert to original</button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => { setIsEditOpen(false); setEditImage(null); }} disabled={submitting}>Cancel</Button>
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
                        <AlertDialogTitle>Delete this gift item?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{selected?.category}</strong>.
                        </AlertDialogDescription>
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

export default GiftCatalog;
