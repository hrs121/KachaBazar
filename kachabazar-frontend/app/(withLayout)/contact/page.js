import React from 'react';

export default function ContactPage() {
  return (
    <div>
      {/* Breadcrumb Section */}
      <section className="bg-cover bg-center py-12" style={{ backgroundImage: "url('/img/breadcrumb.jpg')" }}>
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">Contact Us</h2>
          <div className="mt-2 text-white">
            <a href="/home" className="hover:underline">Home</a> <span className="mx-2">/</span> <span>Contact Us</span>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-4xl">📞</span>
            <h4 className="text-lg font-semibold mt-2">Phone</h4>
            <p>+01-3-8888-6868</p>
          </div>
          <div>
            <span className="text-4xl">📍</span>
            <h4 className="text-lg font-semibold mt-2">Address</h4>
            <p>60-49 Road 11378 New York</p>
          </div>
          <div>
            <span className="text-4xl">⏰</span>
            <h4 className="text-lg font-semibold mt-2">Open Time</h4>
            <p>10:00 am to 23:00 pm</p>
          </div>
          <div>
            <span className="text-4xl">✉️</span>
            <h4 className="text-lg font-semibold mt-2">Email</h4>
            <p>hello@colorlib.com</p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className="relative h-[500px] w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49116.39176087041!2d-86.41867791216099!3d39.69977417971648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886ca48c841038a1%3A0x70cfba96bf847f0!2sPlainfield%2C%20IN%2C%20USA!5e0!3m2!1sen!2sbd!4v1586106673811!5m2!1sen!2sbd"
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen=""
          loading="lazy"
          aria-hidden="false"
          tabIndex="0"
        ></iframe>
        <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-lg z-10">
          <h4 className="font-semibold">New York</h4>
          <ul className="text-sm mt-2">
            <li>Phone: +12-345-6789</li>
            <li>Add: 16 Creek Ave. Farmingdale, NY</li>
          </ul>
        </div>
      </div>

      {/* Contact Form */}
      <div className="py-12">
        <div className="container mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Leave Message</h2>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Your name" className="border p-3 rounded w-full" />
            <input type="email" placeholder="Your Email" className="border p-3 rounded w-full" />
            <textarea
              placeholder="Your message"
              className="md:col-span-2 border p-3 rounded w-full h-32"
            ></textarea>
            <div className="md:col-span-2 text-center">
              <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
                SEND MESSAGE
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
