"use client"

import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const VerifyPage = () => {
    const router = useRouter();
    const params = useParams<{username: string}>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {toast} = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            setIsSubmitting(true);
            const response = await axios.post<ApiResponse>(`/api/verify`, {
                username: params.username,
                verifyCode: data.code 
            })
            toast({
                title: "Success",
                description: response.data.message
            })
            router.push(`/sign-in`);
        } catch(e) {
            const axiosError = e as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message ?? 'An error occurred. Please try again.',
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false);
        }
    } 
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-2xl font-extrabold tracking-tight lg:text-5xl mb-2">
                  Join Anonymity
                </h1>
                <p className="mb-4 text-muted-foreground text-sm">Please enter the verification code</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Verify Code</FormLabel>
                            <FormControl>
                            <Input placeholder="code" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting}>Submit</Button>
                    </form>
                </Form>
            </div>
            </div>
        </div>
    )
}
export default VerifyPage;