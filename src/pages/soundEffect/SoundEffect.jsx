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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus, Pencil, Trash, Play, Pause, Loader2, RefreshCw } from "lucide-react";
import { toast } from 'sonner';
import { soundEffectService } from '@/services';

const SoundEffect = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSound, setSelectedSound] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [audioRef, setAudioRef] = useState(null);

  useEffect(() => {
    fetchSoundEffects();
    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.src = '';
      }
    };
  }, []);

  const fetchSoundEffects = async () => {
    try {
      setLoading(true);
      const response = await soundEffectService.getAll();
      setData(response.data || []);
      if (response.success) {
        toast.success(`Loaded ${response.count} sound effects`);
      }
    } catch (error) {
      console.error('Error fetching sound effects:', error);
      toast.error(error.message || 'Failed to load sound effects');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      setSubmitting(true);
      const soundData = {
        name: formData.get('name'),
        status: formData.get('status') === '0' ? 0 : 1,
        audio: formData.get('audio'),
        icon: formData.get('icon'),
      };

      await soundEffectService.create(soundData);
      toast.success("Sound effect created successfully");
      setIsAddOpen(false);
      fetchSoundEffects();
      e.target.reset();
    } catch (error) {
      console.error('Error creating sound effect:', error);
      toast.error(error.message || 'Failed to create sound effect');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      setSubmitting(true);
      const soundData = {
        name: formData.get('name'),
        status: formData.get('status') === '0' ? 0 : 1,
      };

      const audioFile = formData.get('audio');
      const iconFile = formData.get('icon');

      if (audioFile && audioFile.size > 0) {
        soundData.audio = audioFile;
      }
      if (iconFile && iconFile.size > 0) {
        soundData.icon = iconFile;
      }

      await soundEffectService.update(selectedSound.id, soundData);
      toast.success("Sound effect updated successfully");
      setIsEditOpen(false);
      fetchSoundEffects();
    } catch (error) {
      console.error('Error updating sound effect:', error);
      toast.error(error.message || 'Failed to update sound effect');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await soundEffectService.delete(selectedSound.id);
      toast.success("Sound effect deleted successfully");
      setIsDeleteOpen(false);
      fetchSoundEffects();
    } catch (error) {
      console.error('Error deleting sound effect:', error);
      toast.error(error.message || 'Failed to delete sound effect');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (sound) => {
    try {
      await soundEffectService.toggleStatus(sound.id);
      toast.success("Sound effect status updated");
      fetchSoundEffects();
    } catch (error) {
      console.error('Error toggling sound effect status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handlePlayPause = (sound) => {
    const soundId = sound.id;
    const audioUrl = `http://31.97.62.250:3000${sound.audio}`;

    if (playingId === soundId) {
      audioRef?.pause();
      setPlayingId(null);
    } else {
      if (audioRef) {
        audioRef.pause();
      }
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => setPlayingId(null);
      setAudioRef(audio);
      setPlayingId(soundId);
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
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
          {row.original.icon ? (
            <img src={`http://31.97.62.250:3000${row.original.icon}`} alt={row.original.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs">🔊</span>
          )}
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
      id: "play",
      header: "Preview",
      cell: ({ row }) => {
        const sound = row.original;
        const soundId = sound.id;
        const isPlaying = playingId === soundId;

        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePlayPause(sound)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const sound = row.original;
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
              <DropdownMenuItem onClick={() => { setSelectedSound(sound); setIsEditOpen(true); }}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Sound
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleStatus(sound)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Toggle Status
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { setSelectedSound(sound); setIsDeleteOpen(true); }} className="text-destructive focus:text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete Sound
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
          <h2 className="text-3xl font-bold tracking-tight">Sound Effects</h2>
          <p className="text-muted-foreground">Manage audio effects and sounds</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchSoundEffects} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Sound
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

      {/* Add Sound Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Sound Effect</DialogTitle>
            <DialogDescription>
              Upload a new sound effect to the library.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" placeholder="Applause" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="audio" className="text-right">Audio File</Label>
                <Input id="audio" name="audio" type="file" accept="audio/*" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">Icon</Label>
                <Input id="icon" name="icon" type="file" accept="image/*" className="col-span-3" />
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
                Add Sound
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Sound Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Sound Effect</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input id="edit-name" name="name" defaultValue={selectedSound?.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-audio" className="text-right">Audio File</Label>
                <Input id="edit-audio" name="audio" type="file" accept="audio/*" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-icon" className="text-right">Icon</Label>
                <Input id="edit-icon" name="icon" type="file" accept="image/*" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">Status</Label>
                <Select name="status" defaultValue={String(selectedSound?.status)}>
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

      {/* Delete Sound Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this sound effect?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove "{selectedSound?.name}" from the library.
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

export default SoundEffect