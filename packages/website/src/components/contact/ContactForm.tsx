'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { InputField } from '@yanbrain/shared/ui'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormData = z.infer<typeof formSchema>

export function ContactForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(data) // Replace with actual email sending
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Name</Label>
        <InputField
          id="name"
          {...register('name')}
          placeholder="Your name"
          className="mt-2 border-white/10 bg-black/40 text-white outline outline-1 outline-white/10 placeholder:text-white/40 focus-visible:ring-white/20"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <InputField
          id="email"
          type="email"
          {...register('email')}
          placeholder="your@email.com"
          className="mt-2 border-white/10 bg-black/40 text-white outline outline-1 outline-white/10 placeholder:text-white/40 focus-visible:ring-white/20"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <InputField
          id="subject"
          {...register('subject')}
          placeholder="How can we help?"
          className="mt-2 border-white/10 bg-black/40 text-white outline outline-1 outline-white/10 placeholder:text-white/40 focus-visible:ring-white/20"
        />
        {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder="Tell us more..."
          rows={5}
          className="mt-2 border-white/10 bg-black/40 text-white outline outline-1 outline-white/10 placeholder:text-white/40 focus-visible:ring-white/20"
        />
        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        variant="outline"
        className="w-full border-white/20 text-white outline outline-1 outline-white/20 hover:border-white/40 hover:bg-white/5"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
