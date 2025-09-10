
"use client";

import { useState } from 'react';
import { SecureMessageHeader } from '@/components/SecureMessage/SecureMessageHeader';
import { UserPanel } from '@/components/SecureMessage/UserPanel';
import { KeyDisplay } from '@/components/SecureMessage/KeyDisplay';
import { encryptMessage, decryptMessage } from '@/lib/secure-message-utils';
import { ArrowRightToLine, User, UserCheck, Send, MessageSquareDashed, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

export default function SecureMessagePage() {
  const [originalMessage, setOriginalMessage] = useState<string>('');
  const [encryptedMessage, setEncryptedMessage] = useState<string>('');
  const [messageForReceiver, setMessageForReceiver] = useState<string>('');
  const [decryptedMessage, setDecryptedMessage] = useState<string>('');
  const [sharedKey, setSharedKey] = useState<string>('SECRETKEY');

  const { toast } = useToast();

  const handleEncryptAndSend = () => {
    if (!originalMessage) {
      toast({ title: "Input Missing", description: "Please enter a message to encrypt.", variant: "destructive"});
      return;
    }
    if (!sharedKey) {
      toast({ title: "Key Missing", description: "A shared key is required for encryption.", variant: "destructive"});
      return;
    }
    const encMsg = encryptMessage(originalMessage, sharedKey);
    setEncryptedMessage(encMsg);
    setMessageForReceiver(encMsg); 
    setDecryptedMessage(''); 
    toast({ title: "Message Encrypted", description: "Message encrypted and 'sent' to receiver."});
  };

  const handleDecrypt = () => {
    if (!messageForReceiver) {
      toast({ title: "No Message", description: "No encrypted message received to decrypt.", variant: "destructive"});
      return;
    }
     if (!sharedKey) {
      toast({ title: "Key Missing", description: "A shared key is required for decryption.", variant: "destructive"});
      return;
    }
    const decMsg = decryptMessage(messageForReceiver, sharedKey);
    setDecryptedMessage(decMsg);
    toast({ title: "Message Decrypted", description: "Received message has been decrypted."});
  };

  const handleSetSharedKey = (newKey: string) => {
    setSharedKey(newKey);
    setOriginalMessage(''); // Clear original message as it might be confusing with a new key
    setEncryptedMessage('');
    setMessageForReceiver('');
    setDecryptedMessage('');
    toast({
      title: "Shared Key Updated",
      description: "The secret key has been changed. All message fields have been cleared.",
    });
  };

  const handleResetDemo = () => {
    setOriginalMessage('');
    setEncryptedMessage('');
    setMessageForReceiver('');
    setDecryptedMessage('');
    setSharedKey('SECRETKEY'); 
    toast({ title: "Demo Reset", description: "Secure Message Demo has been reset."});
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SecureMessageHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Understanding End-to-End Encryption (E2EE)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              End-to-end encryption ensures that only you and the person you're communicating with can read what's sent.
              No one in between, not even the service provider, can access the content of your messages.
              This demo simulates this process:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>The <span className="font-semibold text-primary">Sender</span> writes a message and encrypts it using a shared secret key.</li>
              <li>The <span className="font-semibold text-accent">Encrypted Message</span> (gibberish to anyone without the key) is "sent".</li>
              <li>The <span className="font-semibold text-primary">Receiver</span> uses the same shared secret key to decrypt the message back to its original form.</li>
            </ul>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] lg:gap-8 items-start">
          {/* Sender Panel */}
          <UserPanel
            title="Sender"
            Icon={User}
            inputLabel="Original Message"
            inputValue={originalMessage}
            onInputChange={setOriginalMessage}
            actionButtonLabel="Encrypt & Send"
            onActionButtonClick={handleEncryptAndSend}
            isActionButtonDisabled={!originalMessage.trim()}
            actionIcon="lock"
            outputLabel="Encrypted Message (Sent)"
            outputValue={encryptedMessage}
            outputPlaceholder="Encrypted message will appear here..."
          />

          {/* "Transmission" Visual Cue */}
          <div className="flex flex-col items-center justify-center lg:pt-40 pt-4 my-4 lg:my-0">
            <MessageSquareDashed className="h-12 w-12 text-muted-foreground" />
            <p className="text-xs text-muted-foreground hidden lg:block mt-2">Secure Channel</p>
          </div>

          {/* Receiver Panel */}
          <UserPanel
            title="Receiver"
            Icon={UserCheck}
            inputLabel="Received Encrypted Message"
            inputValue={messageForReceiver}
            isInputDisabled={true} 
            actionButtonLabel="Decrypt Message"
            onActionButtonClick={handleDecrypt}
            isActionButtonDisabled={!messageForReceiver.trim()}
            actionIcon="unlock"
            outputLabel="Decrypted Message"
            outputValue={decryptedMessage}
            outputPlaceholder="Decrypted message will appear here..."
          />
        </div>

        <KeyDisplay sharedKey={sharedKey} onSetSharedKey={handleSetSharedKey} />

        <div className="mt-10 text-center">
          <Button variant="outline" onClick={handleResetDemo}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Demo
          </Button>
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Secure Message Demo. Educational purposes only.</p>
      </footer>
    </div>
  );
}
