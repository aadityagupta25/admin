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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Power, Eye, Users as UsersIcon, Loader2, RefreshCw, Plus, Pencil } from "lucide-react";
import { toast } from 'sonner';
import { partyService } from '@/services';

const Party = () => {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCloseOpen, setIsCloseOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      setLoading(true);
      const response = await partyService.getAll();
      setData(response.data || []);
      if (response.success) {
        toast.success(`Loaded ${response.count} parties`);
      }
    } catch (error) {
      console.error('Error fetching parties:', error);
      toast.error(error.message || 'Failed to load parties');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      setSubmitting(true);
      const partyData = {
        name: formData.get('name'),
        created_by: formData.get('created_by'),
        rule: formData.get('rule'),
        comment: formData.get('comment'),
        room_lock: formData.get('room_lock') === '1' ? 1 : 0,
        status: formData.get('status') === '1' ? 1 : 0,
        img: formData.get('img'),
      };

      await partyService.create(partyData);
      toast.success("Party created successfully");
      setIsAddOpen(false);
      fetchParties();
      e.target.reset();
    } catch (error) {
      console.error('Error creating party:', error);
      toast.error(error.message || 'Failed to create party');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      setSubmitting(true);
      const partyData = {
        name: formData.get('name'),
        rule: formData.get('rule'),
        comment: formData.get('comment'),
        room_lock: formData.get('room_lock') === '1' ? 1 : 0,
        status: formData.get('status') === '1' ? 1 : 0,
      };

      const imgFile = formData.get('img');
      if (imgFile && imgFile.size > 0) {
        partyData.img = imgFile;
      }

      await partyService.update(selectedParty.id, partyData);
      toast.success("Party updated successfully");
      setIsEditOpen(false);
      fetchParties();
    } catch (error) {
      console.error('Error updating party:', error);
      toast.error(error.message || 'Failed to update party');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseRoom = async () => {
    try {
      setSubmitting(true);
      await partyService.toggleStatus(selectedParty.id);
      toast.success("Party room closed successfully");
      setIsCloseOpen(false);
      fetchParties();
    } catch (error) {
      console.error('Error closing party:', error);
      toast.error(error.message || 'Failed to close party');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (party) => {
    try {
      await partyService.delete(party.id);
      toast.success("Party deleted successfully");
      fetchParties();
    } catch (error) {
      console.error('Error deleting party:', error);
      toast.error(error.message || 'Failed to delete party');
    }
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
      accessorKey: "party_id",
      header: "Party ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.party_id}</div>
      ),
    },
    {
      accessorKey: "img",
      header: "Image",
      cell: ({ row }) => (
        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
          {row.original.img ? (
            <img src={`http://31.97.62.250:3000${row.original.img}`} alt={row.original.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs">🎉</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Room Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "created_by",
      header: "Created By",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.created_by}</div>
      ),
    },
    {
      accessorKey: "joined_by",
      header: "Members",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm">
          <UsersIcon className="w-3 h-3 text-muted-foreground" />
          {row.original.joined_by?.length || 0}
        </div>
      )
    },
    {
      accessorKey: "room_lock",
      header: "Lock",
      cell: ({ row }) => (
        <Badge variant={row.original.room_lock === 1 ? 'destructive' : 'secondary'}>
          {row.original.room_lock === 1 ? 'Locked' : 'Open'}
        </Badge>
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
        const party = row.original;
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
              <DropdownMenuItem onClick={() => { setSelectedParty(party); setIsViewOpen(true); }}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedParty(party); setIsEditOpen(true); }}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Party
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { setSelectedParty(party); setIsCloseOpen(true); }} className="text-destructive focus:text-destructive">
                <Power className="mr-2 h-4 w-4" />
                End Party
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
          <h2 className="text-3xl font-bold tracking-tight">Party Management</h2>
          <p className="text-muted-foreground">Manage live party rooms and events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchParties} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Party
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={data} searchKey="name" />
      )}

      {/* Add Party Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Party</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Room Name</Label>
                <Input id="name" name="name" placeholder="My Party Room" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="created_by" className="text-right">Created By</Label>
                <Input id="created_by" name="created_by" placeholder="10000001" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rule" className="text-right">Rules</Label>
                <Textarea id="rule" name="rule" placeholder="Party rules..." className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comment" className="text-right">Comment</Label>
                <Textarea id="comment" name="comment" placeholder="Additional comments..." className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="img" className="text-right">Image</Label>
                <Input id="img" name="img" type="file" accept="image/*" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room_lock" className="text-right">Room Lock</Label>
                <Select name="room_lock" defaultValue="0">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select lock status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Open</SelectItem>
                    <SelectItem value="1">Locked</SelectItem>
                  </SelectContent>
                </Select>
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
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Party
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Party Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Party</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Room Name</Label>
                <Input id="edit-name" name="name" defaultValue={selectedParty?.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-rule" className="text-right">Rules</Label>
                <Textarea id="edit-rule" name="rule" defaultValue={selectedParty?.rule} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-comment" className="text-right">Comment</Label>
                <Textarea id="edit-comment" name="comment" defaultValue={selectedParty?.comment} className="col-span-3" />
              </div>
              {selectedParty?.img && (
                <div className="col-span-4 flex justify-center">
                  <img src={`http://31.97.62.250:3000${selectedParty.img}`} alt="Current" className="w-full h-48 object-cover rounded-md" />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-img" className="text-right">New Image</Label>
                <Input id="edit-img" name="img" type="file" accept="image/*" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-room_lock" className="text-right">Room Lock</Label>
                <Select name="room_lock" defaultValue={String(selectedParty?.room_lock)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select lock status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Open</SelectItem>
                    <SelectItem value="1">Locked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">Status</Label>
                <Select name="status" defaultValue={String(selectedParty?.status)}>
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
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Party Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Party Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-semibold">Party ID:</span> {selectedParty?.party_id}</div>
              <div><span className="font-semibold">Created By:</span> {selectedParty?.created_by}</div>
              <div><span className="font-semibold">Members:</span> {selectedParty?.joined_by?.length || 0}</div>
              <div><span className="font-semibold">Room Lock:</span> <Badge variant={selectedParty?.room_lock === 1 ? 'destructive' : 'secondary'}>{selectedParty?.room_lock === 1 ? 'Locked' : 'Open'}</Badge></div>
            </div>
            
            {selectedParty?.img && (
              <div className="rounded-md overflow-hidden border">
                <img src={`http://31.97.62.250:3000${selectedParty.img}`} alt={selectedParty.name} className="w-full h-auto object-cover" />
              </div>
            )}

            <div>
              <p className="font-semibold text-sm mb-1">Room Name:</p>
              <p className="text-sm text-muted-foreground">{selectedParty?.name}</p>
            </div>

            {selectedParty?.rule && (
              <div>
                <p className="font-semibold text-sm mb-1">Rules:</p>
                <p className="text-sm text-muted-foreground">{selectedParty.rule}</p>
              </div>
            )}
            
            {selectedParty?.comment && (
              <div>
                <p className="font-semibold text-sm mb-1">Comment:</p>
                <p className="text-sm text-muted-foreground">{selectedParty.comment}</p>
              </div>
            )}

            <div className="text-xs text-muted-foreground border-t pt-2">
              <p>Created: {selectedParty?.created_at_ist}</p>
              <p>Updated: {selectedParty?.updated_at_ist}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Room Alert */}
      <AlertDialog open={isCloseOpen} onOpenChange={setIsCloseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End this party?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately stop the live stream for all viewers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCloseRoom} disabled={submitting} className="bg-destructive hover:bg-destructive/90">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              End Party
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Party