
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';
import { Skull } from 'lucide-react';

const AdvancedOptions = ({ onClearData }) => {
  const { toast } = useToast();

  const handleClearData = () => {
    onClearData();
    toast({ title: 'System Wiped', description: 'All local intelligence has been erased.', variant: 'destructive' });
  };

  return (
    <Card className="border-crimson/80">
      <CardHeader>
        <CardTitle className="text-crimson flex items-center"><Skull className="mr-2 h-5 w-5" /> Danger Zone</CardTitle>
        <CardDescription>Proceed with extreme caution. These actions are irreversible.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto font-bold tracking-wider">Scorched Earth Protocol</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure, agent?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all targets, assessments, and configurations stored in your browser's local storage. There is no going back.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abort Mission</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Confirm & Erase</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <p className="text-sm text-gray-500 font-fira-code">
          // Use this to reset the application to its factory state. All your mock data will be lost in the digital void.
        </p>
      </CardContent>
    </Card>
  );
};

export default AdvancedOptions;
