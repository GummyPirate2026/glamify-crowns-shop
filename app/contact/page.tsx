import ContactForm from './ContactForm'
import { Mail, Phone } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="bg-white">
      <div className="section-container py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Contact Us</h1>
            <p className="mt-4 text-gray-600">Have a question about an order, custom work, or collaboration? We’d love to hear from you.</p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blush rounded-xl p-3">
                  <Mail className="w-5 h-5 text-rose" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-sm text-gray-600">hello@glamifycrowns.example</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-sage rounded-xl p-3">
                  <Phone className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-sm text-gray-600">(555) 123-4567</p>
                </div>
              </div>

              <p className="text-sm text-gray-500">Our typical response time is 1–2 business days. For urgent matters, please indicate that in your message.</p>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-lg font-semibold mb-4">Send us a message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
