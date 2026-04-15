import React, { useState, useEffect } from 'react';
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash, ExternalLink, Loader2, RefreshCw, ImageIcon } from "lucide-react";
import { toast } from 'sonner';
import { bannerService } from '@/services';
import ImageCropper from '@/components/common/ImageCropper';

const Banners = () => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editForm, setEditForm] = useState({ url: '' });
    const [addImage, setAddImage] = useState(null);
    const [editImage, setEditImage] = useState(null);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await bannerService.getAll();
            setData(response.data || []);
            if (response.success) {
                toast.success(`Loaded ${response.count} banners`);
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
            toast.error(error.message || 'Failed to load banners');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            setSubmitting(true);
            if (!addImage) {
                toast.error('Banner image is required');
                return;
            }
            await bannerService.create({ url: formData.get('url'), status: 1, banner_img: addImage });
            toast.success("Banner created successfully");
            setIsAddOpen(false);
            setAddImage(null);
            fetchBanners();
            e.target.reset();
        } catch (error) {
            console.error('Error creating banner:', error);
            toast.error(error.message || 'Failed to create banner');
        } finally {
            setSubmitting(false);
        }
    };

    const openEditDialog = (banner) => {
        setSelectedBanner(banner);
        setEditForm({ url: banner.url || '' });
        setEditImage(null);
        setIsEditOpen(true);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const bannerData = { url: editForm.url };
            if (editImage) bannerData.banner_img = editImage;
            await bannerService.update(selectedBanner.id, bannerData);
            toast.success("Banner updated successfully");
            setIsEditOpen(false);
            fetchBanners();
        } catch (error) {
            console.error('Error updating banner:', error);
            toast.error(error.message || 'Failed to update banner');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            setSubmitting(true);
            await bannerService.delete(selectedBanner.id);
            toast.success("Banner deleted successfully");
            setIsDeleteOpen(false);
            fetchBanners();
        } catch (error) {
            console.error('Error deleting banner:', error);
            toast.error(error.message || 'Failed to delete banner');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (banner) => {
        const newStatus = banner.status === 1 ? 0 : 1;
        setData(prev => prev.map(b => b.id === banner.id ? { ...b, status: newStatus } : b));
        try {
            await bannerService.update(banner.id, { status: newStatus });
            toast.success(`Banner ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            setData(prev => prev.map(b => b.id === banner.id ? { ...b, status: banner.status } : b));
            console.error('Error toggling banner status:', error);
            toast.error(error.message || 'Failed to update status');
        }
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
        // {
        //     accessorKey: "id",
        //     header: "ID",
        //     cell: ({ row }) => (
        //         <div className="font-mono text-sm">{row.original.id}</div>
        //     ),
        // },
        {
            accessorKey: "banner_img",
            header: "Preview",
            cell: ({ row }) => (
                <div className="w-24 h-12 rounded-md overflow-hidden bg-muted relative group">
                    <img
                        src={`https://api.pololive.cloud${row.original.banner_img}`}
                        alt="Banner"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Banner' }}
                    />
                </div>
            ),
        },
        {
            accessorKey: "url",
            header: "Link URL",
            cell: ({ row }) => (
                <div className="flex items-center text-sm text-muted-foreground max-w-[200px] truncate">
                    <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                    {row.getValue("url")}
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const banner = row.original;
                const isActive = banner.status === 1;
                return (
                    <button
                        onClick={() => handleToggleStatus(banner)}
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
            header: "Created At",
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {row.original.created_at_ist}
                </div>
            ),
        },
        {
            accessorKey: "updated_at_ist",
            header: "Updated At",
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {row.original.updated_at_ist}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const banner = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => openEditDialog(banner)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => { setSelectedBanner(banner); setIsDeleteOpen(true); }}
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
                    <h2 className="text-3xl font-bold tracking-tight">Banners Management</h2>
                    <p className="text-muted-foreground">Manage promotional banners and advertisements</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchBanners} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={() => setIsAddOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Banner
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <DataTable columns={columns} data={data} searchKey="url" />
            )}

            {/* Add Banner Dialog */}
            <Dialog open={isAddOpen} onOpenChange={(v) => { setIsAddOpen(v); if (!v) setAddImage(null); }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Banner</DialogTitle>
                        <DialogDescription>Add a new banner to the rotation.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdd}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="url" className="text-right">Link URL</Label>
                                <Input id="url" name="url" placeholder="https://example.com" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Image</Label>
                                <div className="col-span-3 space-y-2">
                                    <ImageCropper aspect={16 / 9} onCropped={(file) => setAddImage(file)}>
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
                                Create Banner
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Banner Dialog */}
            <Dialog open={isEditOpen} onOpenChange={(v) => { setIsEditOpen(v); if (!v) setEditImage(null); }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Banner</DialogTitle>
                        <DialogDescription>Update banner details.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-url" className="text-right">Link URL</Label>
                                <Input
                                    id="edit-url"
                                    value={editForm.url}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, url: e.target.value }))}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Image</Label>
                                <div className="col-span-3 space-y-2">
                                    <ImageCropper aspect={16 / 9} onCropped={(file) => setEditImage(file)}>
                                        <div className="w-full h-32 rounded-md border-2 border-dashed border-muted-foreground/30 hover:border-primary overflow-hidden cursor-pointer relative group">
                                            <img
                                                src={editImage ? URL.createObjectURL(editImage) : `https://api.pololive.cloud${selectedBanner?.banner_img}`}
                                                alt="banner"
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Banner'; }}
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

            {/* Delete Banner Alert */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this banner?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove this banner from the platform.
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
    )
}

export default Banners
