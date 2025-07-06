import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/context/i18n-context"

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] mb-12 rounded-lg overflow-hidden">
        <Image src="/placeholder.svg?height=400&width=1200" alt="MS Furniture Showroom" fill className="object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("about_company")}</h1>
            <p className="text-lg max-w-2xl mx-auto">{t("shop_info")}</p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("our_story")}</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="mb-4">
              MS Furniture was founded in 2010 with a simple mission: to provide high-quality, stylish furniture at
              affordable prices. What began as a small workshop with just three craftsmen has grown into one of
              Bangladesh's premier furniture retailers.
            </p>
            <p>
              Our founder, Mohammad Siddique, started the business with a passion for woodworking and an eye for design.
              His dedication to quality and customer satisfaction remains at the heart of everything we do today.
            </p>
          </div>
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=300&width=500"
              alt="MS Furniture Workshop"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="mb-16 bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("mission_vision")}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">{t("mission")}</h3>
              <p>
                To create beautiful, functional, and durable furniture that enhances the lives of our customers. We
                strive to combine traditional craftsmanship with modern design, using sustainable materials whenever
                possible.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">{t("vision")}</h3>
              <p>
                To become the most trusted furniture brand in Bangladesh, known for exceptional quality, innovative
                design, and outstanding customer service. We aim to create spaces that inspire and bring joy to everyday
                living.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("our_values")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We never compromise on materials or craftsmanship. Every piece is built to last for generations.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We constantly explore new designs, materials, and techniques to create furniture that meets the evolving
                needs of modern living.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Customer Focus</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We put our customers at the center of everything we do, from design to delivery and after-sales service.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("leadership_team")}</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              name: "Mohammad Siddique",
              title: "Founder & CEO",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "Fatima Rahman",
              title: "Creative Director",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "Abdul Karim",
              title: "Head of Production",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "Nusrat Jahan",
              title: "Customer Experience Manager",
              image: "/placeholder.svg?height=300&width=300",
            },
          ].map((person, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className="relative h-[200px] mb-4 rounded-md overflow-hidden">
                  <Image src={person.image || "/placeholder.svg"} alt={person.name} fill className="object-cover" />
                </div>
                <h3 className="font-semibold">{person.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{person.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Our Journey */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("our_journey")}</h2>
        <div className="relative border-l-2 border-red-600 dark:border-red-400 ml-4 md:ml-0 md:mx-auto md:max-w-2xl pl-8 md:pl-0">
          {[
            {
              year: "2010",
              title: "The Beginning",
              description: "MS Furniture was founded with a small workshop in Dhaka.",
            },
            {
              year: "2013",
              title: "First Showroom",
              description: "Opened our first showroom in Gulshan, Dhaka.",
            },
            {
              year: "2016",
              title: "Expansion",
              description: "Expanded production capacity and opened two more showrooms.",
            },
            {
              year: "2019",
              title: "Online Store Launch",
              description: "Launched our e-commerce platform to reach customers nationwide.",
            },
            {
              year: "2022",
              title: "International Recognition",
              description: "Received international design awards for our furniture collections.",
            },
            {
              year: "2024",
              title: "Sustainability Initiative",
              description: "Launched our eco-friendly furniture line using sustainable materials.",
            },
          ].map((milestone, index) => (
            <div
              key={index}
              className={`mb-8 md:grid md:grid-cols-2 md:gap-8 ${
                index % 2 === 0 ? "md:text-right" : "md:text-left md:flex md:flex-row-reverse"
              }`}
            >
              <div
                className={`md:relative ${
                  index % 2 === 0
                    ? "md:before:content-[''] md:before:absolute md:before:right-0 md:before:top-3 md:before:w-8 md:before:h-2 md:before:bg-red-600 md:dark:before:bg-red-400"
                    : "md:before:content-[''] md:before:absolute md:before:left-0 md:before:top-3 md:before:w-8 md:before:h-2 md:before:bg-red-600 md:dark:before:bg-red-400"
                }`}
              >
                <div
                  className={`absolute -left-[25px] md:static md:mb-2 w-12 h-12 rounded-full bg-red-600 dark:bg-red-400 text-white flex items-center justify-center font-bold ${
                    index % 2 === 0 ? "md:ml-auto" : ""
                  }`}
                >
                  {milestone.year}
                </div>
                <h3 className="text-lg font-semibold mt-0 md:mt-2">{milestone.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
              </div>
              <div className={index % 2 === 0 ? "hidden md:block" : "hidden md:block"}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Visit Our Showrooms */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("visit_our_showrooms")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              location: "Gulshan, Dhaka",
              address: "House 21, Road 7, Gulshan-1, Dhaka",
              phone: "+880 1712 345678",
              hours: "10:00 AM - 8:00 PM (Everyday)",
            },
            {
              location: "Dhanmondi, Dhaka",
              address: "House 15, Road 27, Dhanmondi, Dhaka",
              phone: "+880 1712 345679",
              hours: "10:00 AM - 8:00 PM (Everyday)",
            },
            {
              location: "Uttara, Dhaka",
              address: "House 12, Road 13, Sector 7, Uttara, Dhaka",
              phone: "+880 1712 345680",
              hours: "10:00 AM - 8:00 PM (Everyday)",
            },
          ].map((showroom, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{showroom.location}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-1">{showroom.address}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-1">{showroom.phone}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{showroom.hours}</p>
                <Button variant="outline" size="sm">
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-red-600 dark:bg-red-800 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("experience_ms_furniture")}</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Visit one of our showrooms or browse our online collection to find the perfect furniture for your home or
          office. Our team is ready to help you create spaces you'll love.
        </p>
        <Button asChild variant="secondary">
          <Link href="/products">{t("browse_products")}</Link>
        </Button>
      </div>
    </div>
  )
}
