
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Search, LoaderCircle } from 'lucide-react';
import { collection, addDoc, Firestore } from 'firebase/firestore';

import { performPaymentAnalysis, type AnalysisState } from '@/app/actions';
import {
  AnalyzeWebsiteSafetyOutput,
} from '@/ai/flows/analyze-website-safety';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { AnalysisResult } from './analysis-result';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <Search />
      )}
      <span className="ml-2">Analyze Link</span>
    </Button>
  );
}

function savePaymentAnalysis(firestore: Firestore, userId: string, data: any) {
    if (!firestore || !userId) return;
    
    const analysisData = {
    ...data,
    userId: userId,
    analysisDate: new Date().toISOString(),
    paymentLink: data.url,
    };
    const collectionRef = collection(firestore, 'users', userId, 'paymentAnalysis');

    addDoc(collectionRef, analysisData)
      .catch(error => {
        const permissionError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'create',
          requestResourceData: analysisData
        });
        errorEmitter.emit('permission-error', permissionError);
        console.error("Error saving payment analysis:", error);
      });
}


export function PaymentAnalysis() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { user, firestore } = useFirebase();

  const [state, formAction, isPending] = useActionState<AnalysisState<AnalyzeWebsiteSafetyOutput>, FormData>(
    performPaymentAnalysis,
    {}
  );
  
  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  useEffect(() => {
    if (state.data && user && firestore) {
        savePaymentAnalysis(firestore, user.uid, state.data);
        formRef.current?.reset();
    }
  },[state.data, user, firestore])

  return (
    <div className="space-y-6">
      <form ref={formRef} action={formAction} className="flex w-full items-start gap-2">
        <div className="flex-1 space-y-1">
          <Input
            name="paymentLink"
            placeholder="payment.provider.com/..."
            className="text-base"
            required
            type="text"
          />
          {state.fieldErrors?.paymentLink && (
            <p className="text-sm text-destructive">{state.fieldErrors.paymentLink[0]}</p>
          )}
        </div>
        <SubmitButton />
      </form>
      <AnalysisResult<AnalyzeWebsiteSafetyOutput> state={state} pending={isPending} type="payment" />
    </div>
  );
}
