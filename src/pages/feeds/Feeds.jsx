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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Trash, MessageSquare, Heart, Share2, Bookmark, Loader2, RefreshCw, Plus, Pencil, Play, Image as ImageIcon } from "lucide-react";
import { toast } from 'sonner';
import { feedService } from '@/services';

const Feeds = () => {
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedFeed, setSelectedFeed] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchFeeds();
    }, []);

    const fetchFeeds = async () => {
        try {
            setLoading(true);
            const response = await feedService.getAll();
            setData(response.data || []);
            if (response.success) {
                toast.success(`Loaded ${response.count} feeds`);
            }
        } catch (error) {
            console.error('Error fetching feeds:', error);
            toast.error(error.message || 'Failed to load feeds');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const mediaFile = formData.get('media');

        if (!mediaFile || mediaFile.size === 0) {
            toast.error('Media file is required');
            return;
        }

        try {
            setSubmitting(true);
            const feedData = {
                user_id: formData.get('user_id'),
                details: formData.get('details'),
                location: formData.get('location'),
                status: formData.get('status') === '1' ? 1 : 0,
                media: mediaFile,
            };

            await feedService.create(feedData);
            toast.success("Feed created successfully");
            setIsAddOpen(false);
            fetchFeeds();
            e.target.reset();
        } catch (error) {
            console.error('Error creating feed:', error);
            toast.error(error.message || 'Failed to create feed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            setSubmitting(true);
            const feedData = {
                details: formData.get('details'),
                location: formData.get('location'),
                status: formData.get('status') === '1' ? 1 : 0,
            };

            const mediaFile = formData.get('media');
            if (mediaFile && mediaFile.size > 0) {
                feedData.media = mediaFile;
            }

            await feedService.update(selectedFeed.id, feedData);
            toast.success("Feed updated successfully");
            setIsEditOpen(false);
            fetchFeeds();
        } catch (error) {
            console.error('Error updating feed:', error);
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
            console.error('Error deleting feed:', error);
            toast.error(error.message || 'Failed to delete feed');
        } finally {
            setSubmitting(false);
        }
    };

    const getMediaUrl = (mediaPath) => {
        if (!mediaPath) return null;
        if (mediaPath.startsWith('http')) return mediaPath;
        return `http://31.97.62.250:3000${mediaPath}`;
    };

    const columns = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <div className="font-mono text-sm">{row.original.id}</div>
            ),
        },
        {
            accessorKey: "feed_id",
            header: "Feed ID",
            cell: ({ row }) => (
                <div className="font-mono text-sm">{row.original.feed_id}</div>
            ),
        },
        {
            accessorKey: "user_id",
            header: "User ID",
            cell: ({ row }) => (
                <div className="font-mono text-sm">{row.original.user_id}</div>
            ),
        },
        {
            accessorKey: "media_type",
            header: "Type",
            cell: ({ row }) => (
                <Badge variant="outline" className="capitalize">
                    {row.original.media_type === 'video' ? (
                        <><Play className="w-3 h-3 mr-1" /> Video</>
                    ) : (
                        <><ImageIcon className="w-3 h-3 mr-1" /> Image</>
                    )}
                </Badge>
            ),
        },
        {
            accessorKey: "media_url",
            header: "Preview",
            cell: ({ row }) => (
                <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                    {row.original.media_type === 'video' ? (
                        <video src={getMediaUrl(row.original.media_url)} className="w-full h-full object-cover" />
                    ) : (
                        <img src={getMediaUrl(row.original.media_url)} alt="Feed" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Feed' }} />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "details",
            header: "Details",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate text-sm">
                    {row.original.details || '-'}
                </div>
            ),
        },
        {
            id: "engagement",
            header: "Engagement",
            cell: ({ row }) => (
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {row.original.like_count}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {row.original.comment_count}</span>
                    <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {row.original.share_count}</span>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.status === 1 ? 'default' : 'secondary'}>
                    {row.original.status === 1 ? 'Active' : 'Inactive'}
                </Badge>
            ),
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
            id: "actions",
            cell: ({ row }) => {
                const feed = row.original;
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
                            <DropdownMenuItem onClick={() => { setSelectedFeed(feed); setIsViewOpen(true); }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSelectedFeed(feed); setIsEditOpen(true); }}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Feed
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setSelectedFeed(feed); setIsDeleteOpen(true); }} className="text-destructive focus:text-destructive">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Feed
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                    <Button onClick={() => setIsAddOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Feed
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <DataTable columns={columns} data={data} searchKey="details" />
            )}

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create Feed</DialogTitle>
                        <DialogDescription>Add a new feed post.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdd}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="user_id" className="text-right">User ID</Label>
                                <Input id="user_id" name="user_id" placeholder="10000001" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="details" className="text-right">Details</Label>
                                <Textarea id="details" name="details" placeholder="Feed description with #hashtags and @mentions" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="location" className="text-right">Location</Label>
                                <Input id="location" name="location" placeholder="New York, USA" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="media" className="text-right">Media</Label>
                                <Input id="media" name="media" type="file" accept="image/*,video/*" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <Select name="status" defaultValue="1">
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Active</SelectItem>
                                        <SelectItem value="0">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={submitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Feed
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Feed</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEdit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-details" className="text-right">Details</Label>
                                <Textarea id="edit-details" name="details" defaultValue={selectedFeed?.details} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-location" className="text-right">Location</Label>
                                <Input id="edit-location" name="location" defaultValue={selectedFeed?.location} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-status" className="text-right">Status</Label>
                                <Select name="status" defaultValue={String(selectedFeed?.status)}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Active</SelectItem>
                                        <SelectItem value="0">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {selectedFeed?.media_url && (
                                <div className="col-span-4 flex justify-center">
                                    {selectedFeed.media_type === 'video' ? (
                                        <video src={getMediaUrl(selectedFeed.media_url)} controls className="w-full h-48 object-cover rounded-md" />
                                    ) : (
                                        <img src={getMediaUrl(selectedFeed.media_url)} alt="Current media" className="w-full h-48 object-cover rounded-md" />
                                    )}
                                </div>
                            )}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-media" className="text-right">New Media</Label>
                                <Input id="edit-media" name="media" type="file" accept="image/*,video/*" className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={submitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Feed Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="font-semibold">Feed ID:</span> {selectedFeed?.feed_id}</div>
                            <div><span className="font-semibold">User ID:</span> {selectedFeed?.user_id}</div>
                            <div><span className="font-semibold">Type:</span> <Badge variant="outline" className="capitalize">{selectedFeed?.media_type}</Badge></div>
                            <div><span className="font-semibold">Status:</span> <Badge variant={selectedFeed?.status === 1 ? 'default' : 'secondary'}>{selectedFeed?.status === 1 ? 'Active' : 'Inactive'}</Badge></div>
                        </div>

                        {selectedFeed?.media_url && (
                            <div className="rounded-md overflow-hidden border">
                                {selectedFeed.media_type === 'video' ? (
                                    <video src={getMediaUrl(selectedFeed.media_url)} controls className="w-full h-auto" />
                                ) : (
                                    <img src={getMediaUrl(selectedFeed.media_url)} alt="Feed media" className="w-full h-auto object-cover" />
                                )}
                            </div>
                        )}

                        {selectedFeed?.details && (
                            <div>
                                <p className="font-semibold text-sm mb-1">Details:</p>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedFeed.details}</p>
                            </div>
                        )}

                        {selectedFeed?.location && (
                            <div>
                                <p className="font-semibold text-sm">Location: <span className="font-normal text-muted-foreground">{selectedFeed.location}</span></p>
                            </div>
                        )}

                        <div className="flex items-center gap-6 pt-2 border-t text-sm">
                            <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-rose-500" /> {selectedFeed?.like_count} Likes</span>
                            <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4 text-blue-500" /> {selectedFeed?.comment_count} Comments</span>
                            <span className="flex items-center gap-1"><Share2 className="w-4 h-4 text-green-500" /> {selectedFeed?.share_count} Shares</span>
                            <span className="flex items-center gap-1"><Bookmark className="w-4 h-4 text-amber-500" /> {selectedFeed?.saved?.length || 0} Saved</span>
                        </div>

                        <div className="text-xs text-muted-foreground border-t pt-2">
                            <p>Created: {selectedFeed?.created_at_ist}</p>
                            <p>Updated: {selectedFeed?.updated_at_ist}</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this feed?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove this feed post from the platform.
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

export default Feeds
