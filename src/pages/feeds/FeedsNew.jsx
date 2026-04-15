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
import { Eye, Trash, Pencil, Plus, MessageSquare, Heart, Loader2, RefreshCw, ImageIcon } from "lucide-react";
import { toast } from 'sonner';
import { feedService } from '@/services';
import ImageCropper from '@/components/common/ImageCropper';

const BASE_URL = 'https://api.pololive.cloud';

const Feeds = () => {
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedFeed, setSelectedFeed] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Add form state
    const [addForm, setAddForm] = useState({ user_id: '', details: '', location: '' });
    const [addMedia, setAddMedia] = useState(null);

    // Edit form state
    const [editForm, setEditForm] = useState({ details: '', location: '' });
    const [editMedia, setEditMedia] = useState(null);

    useEffect(() => { fetchFeeds(); }, []);

    const fetchFeeds = async () => {
        try {
            setLoading(true);
            const response = await feedService.getAll();
            setData(response.data || []);
        } catch (error) {
            toast.error(error.message || 'Failed to load feeds');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!addForm.user_id.trim()) return toast.error('User ID is required');
        if (!addMedia) return toast.error('Media file is required');
        try {
            setSubmitting(true);
            await feedService.create({
                user_id: addForm.user_id,
                details: addForm.details,
                location: addForm.location,
                media: addMedia,
            });
            toast.success('Feed created successfully');
            setIsAddOpen(false);
            setAddForm({ user_id: '', details: '', location: '' });
            setAddMedia(null);
            fetchFeeds();
        } catch (error) {
            toast.error(error.message || 'Failed to create feed');
        } finally {
            setSubmitting(false);
        }
    };

    const openEditDialog = (feed) => {
        setSelectedFeed(feed);
        setEditForm({ details: feed.details || '', location: feed.location || '' });
        setEditMedia(null);
        setIsEditOpen(true);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const payload = { details: editForm.details, location: editForm.location };
            if (editMedia) payload.media = editMedia;
            await feedService.update(selectedFeed.id, payload);
            toast.success('Feed updated successfully');
            setIsEditOpen(false);
            fetchFeeds();
        } catch (error) {
            toast.error(error.message || 'Failed to update feed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            setSubmitting(true);
            await feedService.delete(selectedFeed.id);
            toast.success("Feed deleted successfully");
            setIsDeleteOpen(false);
            fetchFeeds();
        } catch (error) {
            toast.error(error.message || 'Failed to delete feed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (feed) => {
        const newStatus = feed.status === 1 ? 0 : 1;
        setData(prev => prev.map(f => f.id === feed.id ? { ...f, status: newStatus } : f));
        try {
            await feedService.update(feed.id, { status: newStatus });
            toast.success(`Feed ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            setData(prev => prev.map(f => f.id === feed.id ? { ...f, status: feed.status } : f));
            toast.error(error.message || 'Failed to update status');
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
            id: "media",
            header: "Media",
            cell: ({ row }) => {
                const { media_url, media_type } = row.original;
                if (!media_url) return (
                    <div className="w-16 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">No media</div>
                );
                return (
                    <div className="w-16 h-10 rounded-md overflow-hidden bg-muted">
                        {media_type === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white text-xs">▶ Video</div>
                        ) : (
                            <img src={`${BASE_URL}${media_url}`} alt="feed" className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }} />
                        )}
                    </div>
                );
            },
        },
        {
            id: "details",
            header: "Caption",
            cell: ({ row }) => (
                <div className="max-w-[220px] truncate text-sm text-muted-foreground">
                    {row.original.details || <span className="italic">No caption</span>}
                </div>
            ),
        },
        {
            id: "user_id",
            header: "User ID",
            cell: ({ row }) => <div className="font-mono text-sm">{row.original.user_id}</div>,
        },
        {
            id: "media_type",
            header: "Type",
            cell: ({ row }) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    row.original.media_type === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                    {row.original.media_type}
                </span>
            ),
        },
        {
            id: "engagement",
            header: "Engagement",
            cell: ({ row }) => {
                const { like_count = 0, comment_count = 0 } = row.original;
                return (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {like_count}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {comment_count}</span>
                    </div>
                );
            },
        },
        {
            id: "status",
            header: "Status",
            cell: ({ row }) => {
                const feed = row.original;
                const isActive = feed.status === 1;
                return (
                    <button
                        onClick={() => handleToggleStatus(feed)}
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
            id: "created_at",
            header: "Created At",
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground whitespace-nowrap">{row.original.created_at_ist || '-'}</div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const feed = row.original;
                return (
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => { setSelectedFeed(feed); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => openEditDialog(feed)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => { setSelectedFeed(feed); setIsDeleteOpen(true); }}>
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
                    <h2 className="text-3xl font-bold tracking-tight">Feeds Management</h2>
                    <p className="text-muted-foreground">Manage user-generated content and posts</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchFeeds} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={() => { setAddForm({ user_id: '', details: '', location: '' }); setAddMedia(null); setIsAddOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" /> Add Feed
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <DataTable columns={columns} data={data} searchKey="user_id" />
            )}

            {/* Add Feed Dialog */}
            <Dialog open={isAddOpen} onOpenChange={(v) => { setIsAddOpen(v); if (!v) setAddMedia(null); }}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Add Feed</DialogTitle>
                        <DialogDescription>Create a new feed post.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdd}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">User ID</Label>
                                <Input
                                    className="col-span-3"
                                    placeholder="e.g. 10000001"
                                    value={addForm.user_id}
                                    onChange={(e) => setAddForm(p => ({ ...p, user_id: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Caption</Label>
                                <textarea
                                    className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                    placeholder="Write a caption..."
                                    value={addForm.details}
                                    onChange={(e) => setAddForm(p => ({ ...p, details: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Location</Label>
                                <Input
                                    className="col-span-3"
                                    placeholder="e.g. New York, USA"
                                    value={addForm.location}
                                    onChange={(e) => setAddForm(p => ({ ...p, location: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Media</Label>
                                <div className="col-span-3 space-y-2">
                                    <ImageCropper aspect={1} onCropped={(file) => setAddMedia(file)}>
                                        <div className={`w-full h-32 rounded-md border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors overflow-hidden ${
                                            addMedia ? 'border-primary' : 'border-muted-foreground/30 hover:border-primary'
                                        }`}>
                                            {addMedia ? (
                                                <img src={URL.createObjectURL(addMedia)} className="w-full h-full object-cover" alt="preview" />
                                            ) : (
                                                <>
                                                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">Click to select &amp; crop image</span>
                                                </>
                                            )}
                                        </div>
                                    </ImageCropper>
                                    {addMedia && (
                                        <button type="button" onClick={() => setAddMedia(null)} className="text-xs text-destructive hover:underline">Remove</button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => { setIsAddOpen(false); setAddMedia(null); }} disabled={submitting}>Cancel</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Feed
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Feed Dialog */}
            <Dialog open={isEditOpen} onOpenChange={(v) => { setIsEditOpen(v); if (!v) setEditMedia(null); }}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Edit Feed</DialogTitle>
                        <DialogDescription>Update caption, location or replace media.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Caption</Label>
                                <textarea
                                    className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                    placeholder="Write a caption..."
                                    value={editForm.details}
                                    onChange={(e) => setEditForm(p => ({ ...p, details: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Location</Label>
                                <Input
                                    className="col-span-3"
                                    placeholder="e.g. New York, USA"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm(p => ({ ...p, location: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Media</Label>
                                <div className="col-span-3 space-y-2">
                                    <ImageCropper aspect={1} onCropped={(file) => setEditMedia(file)}>
                                        <div className="w-full h-32 rounded-md border-2 border-dashed border-muted-foreground/30 hover:border-primary overflow-hidden cursor-pointer relative group">
                                            {editMedia ? (
                                                <img src={URL.createObjectURL(editMedia)} className="w-full h-full object-cover" alt="new media" />
                                            ) : selectedFeed?.media_url && selectedFeed?.media_type !== 'video' ? (
                                                <>
                                                    <img src={`${BASE_URL}${selectedFeed.media_url}`} className="w-full h-full object-cover" alt="current"
                                                        onError={(e) => { e.target.style.display = 'none'; }} />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white text-xs font-medium">Click to replace &amp; crop</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">Click to select &amp; crop image</span>
                                                </div>
                                            )}
                                        </div>
                                    </ImageCropper>
                                    {editMedia && (
                                        <button type="button" onClick={() => setEditMedia(null)} className="text-xs text-destructive hover:underline">Revert to original</button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => { setIsEditOpen(false); setEditMedia(null); }} disabled={submitting}>Cancel</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Feed Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Post Details</DialogTitle>
                    </DialogHeader>
                    {selectedFeed && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div><span className="text-muted-foreground">Feed ID:</span> <span className="font-mono">{selectedFeed.feed_id}</span></div>
                                <div><span className="text-muted-foreground">User ID:</span> <span className="font-mono">{selectedFeed.user_id}</span></div>
                                <div><span className="text-muted-foreground">Type:</span> {selectedFeed.media_type}</div>
                                <div><span className="text-muted-foreground">Views:</span> {selectedFeed.view_count}</div>
                                <div><span className="text-muted-foreground">Created:</span> {selectedFeed.created_at_ist}</div>
                                <div><span className="text-muted-foreground">Updated:</span> {selectedFeed.updated_at_ist}</div>
                            </div>
                            {selectedFeed.details && (
                                <p className="text-sm bg-muted p-3 rounded-md">{selectedFeed.details}</p>
                            )}
                            {selectedFeed.media_url && (
                                <div className="rounded-md overflow-hidden border">
                                    {selectedFeed.media_type === 'video' ? (
                                        <video src={`${BASE_URL}${selectedFeed.media_url}`} controls className="w-full max-h-64 object-cover" />
                                    ) : (
                                        <img src={`${BASE_URL}${selectedFeed.media_url}`} alt="Post media" className="w-full max-h-64 object-cover"
                                            onError={(e) => { e.target.style.display = 'none'; }} />
                                    )}
                                </div>
                            )}
                            <div className="flex items-center gap-6 pt-2 border-t text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-rose-500" /> {selectedFeed.like_count} Likes</span>
                                <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4 text-blue-500" /> {selectedFeed.comment_count} Comments</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently remove the post. This action cannot be undone.</AlertDialogDescription>
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

export default Feeds;
