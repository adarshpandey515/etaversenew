"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    text:
      "The 3D menu is absolutely amazing! Being able to see the food in AR before ordering made our dining experience so much better.",
  },
  {
    name: "Mike Chen",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    text:
      "Revolutionary dining experience! The food looks exactly like the 3D models. Highly recommended!",
  },
  {
    name: "Priya Singh",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    text:
      "I loved being able to show my kids the food in 3D before ordering. Fun and useful!",
  },
]

export default function ContactSection() {
  return (
    <section className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gray-800 bg-clip-text text-transparent">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Have questions about our 3D menu or want to make a reservation? We'd love to hear from you!
          </p>
        </div>

        {/* Testimonials Row */}
        <Card className="  bg-transparent border-[0px] ">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 text-center">What Our Customers Say</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row  pt-5 justify-center gap-6 md:gap-8">
              {testimonials.map((review, i) => (
                <div
                  key={review.name}
                  className="relative p-6  flex flex-col items-center gap-2  max-w-xs w-full"
                >
                  <img
                    src={review.img}
                    alt={review.name}
                    className="w-16 h-16 rounded-full border-2 border-white shadow-lg object-cover -mt-10 mb-2"
                    style={{ objectPosition: "center" }}
                  />
                  <div className="flex items-center space-x-1">
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} className="w-5 h-5 fill-[#fccd3f] text-[#fccd3f]" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic text-center">"{review.text}"</p>
                  <p className="text-sm text-gray-600 mt-2 font-semibold">{review.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Info and Form, same height */}
        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          {/* Visit Us */}
          <div className="flex-1 flex">
            <Card className=" bg-transparent border-gray-400 flex flex-col w-full">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Visit Us</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-center space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#fccd3f] bg-opacity-30 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Address</h3>
                    <p className="text-gray-600">
                      123 Food Street, Culinary District
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#fccd3f] bg-opacity-30 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#fccd3f] bg-opacity-30 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">hello@tastyrestaurant.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#fccd3f] bg-opacity-30 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Hours</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Mon - Thu: 11:00 AM - 10:00 PM</p>
                      <p>Fri - Sat: 11:00 AM - 11:00 PM</p>
                      <p>Sunday: 12:00 PM - 9:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Send us a Message */}
          <div className="flex-1 flex">
            <Card className="bg-transparent backdrop-blur-sm border-gray-400 flex flex-col w-full">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-center">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" className="border-gray-400 focus:border-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" className="border-gray-400 focus:border-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="border-gray-400 focus:border-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="border-gray-400 focus:border-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Reservation inquiry"
                      className="border-gray-400 focus:border-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className="border-gray-400 focus:border-gray-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#6c6a66] to-[#fef4ea] hover:from-[#fccd3f] hover:to-[#fef4ea] text-gray-800 py-3 font-semibold"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .glare-card {
          position: relative;
          overflow: hidden;
        }
        .glare-card::before {
          content: "";
          position: absolute;
          top: -60%;
          left: -60%;
          width: 200%;
          height: 200%;
          background: linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(252,205,63,0.22) 100%);
          transform: rotate(8deg);
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: lighten;
        }
        .glare-card > * {
          position: relative;
          z-index: 2;
        }
      `}</style>
    </section>
  )
}