import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Mail, MapPin, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

function AboutPage() {
  const teamMembers = [
    {
      name: "Maria Johnson",
      role: "Founder & Head Chef",
      image: "https://themewagon.github.io/delicious/img/bg-img/insta3.jpg",
      bio: "With over 15 years of culinary experience in Michelin-starred restaurants across Europe, Maria founded RecipeHub to make gourmet cooking accessible to everyone.",
      social: {
        instagram: "chef_maria",
        twitter: "mariajohnson",
      }
    },
    {
      name: "David Chen",
      role: "Executive Chef",
      image: "https://themewagon.github.io/delicious/img/bg-img/insta3.jpg",
      bio: "David specializes in Asian fusion cuisine and brings international flavors to our recipe collection. He's been featured on multiple cooking shows and has authored two cookbooks.",
      social: {
        instagram: "chef_david",
        twitter: "davidchenchef",
      }
    },
    {
      name: "Sarah Williams",
      role: "Pastry Chef",
      image: "https://themewagon.github.io/delicious/img/bg-img/insta3.jpg",
      bio: "Sarah is our dessert expert with a background in French patisserie. Her creative and visually stunning desserts have won multiple awards and delighted thousands.",
      social: {
        instagram: "sweet_sarah",
        twitter: "sarahwilliams",
      }
    },
    {
      name: "Michael Brown",
      role: "Nutritionist",
      image: "https://themewagon.github.io/delicious/img/bg-img/insta3.jpg",
      bio: "Michael ensures our recipes are balanced and provides nutritional information for health-conscious cooks. He holds a Master's degree in Nutrition Science from Stanford.",
      social: {
        instagram: "nutrition_mike",
        twitter: "michaelbrown",
      }
    }
  ];

  const testimonials = [
    {
      name: "Emily Rodriguez",
      role: "Home Cook",
      image: "https://themewagon.github.io/delicious/img/bg-img/insta3.jpg",
      quote: "RecipeHub transformed my cooking journey. I went from burning toast to making restaurant-quality meals for my family. The step-by-step instructions are foolproof!",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Food Blogger",
      image: "https://themewagon.github.io/delicious/img/bg-img/insta3.jpg",
      quote: "As someone who creates food content, I'm impressed by the quality and reliability of RecipeHub's recipes. They're always well-tested and the results are consistently delicious.",
      rating: 5
    },
    {
      name: "Sophia Lee",
      role: "Busy Parent",
      image: "https://themewagon.github.io/delicious/img/bg-img/insta3.jpg",
      quote: "The meal planning features have saved me so much time. I can quickly find healthy recipes my kids will actually eat, and the shopping lists make grocery trips a breeze.",
      rating: 5
    }
  ];

  const milestones = [
    {
      year: "2018",
      title: "The Beginning",
      description: "RecipeHub started as a small blog sharing family recipes from around the world."
    },
    {
      year: "2019",
      title: "Growing Community",
      description: "Our community grew to over 100,000 home cooks sharing their own recipes and tips."
    },
    {
      year: "2020",
      title: "Mobile App Launch",
      description: "We launched our mobile app, making it easier to access recipes in the kitchen."
    },
    {
      year: "2021",
      title: "Cookbook Published",
      description: "Our first official cookbook featuring the most popular community recipes was published."
    },
    {
      year: "2022",
      title: "Cooking Classes",
      description: "We began offering virtual cooking classes taught by professional chefs."
    },
    {
      year: "2023",
      title: "Global Expansion",
      description: "RecipeHub expanded to support multiple languages and regional cuisine specialties."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10"></div>
          <div className="relative h-[500px] w-full overflow-hidden">
            <img
              src="https://themewagon.github.io/delicious/img/bg-img/add.png"
              alt="Kitchen team cooking"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 flex items-center z-20">
            <div className="container">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
                  Bringing People Together Through Food
                </h1>
                <p className="text-lg sm:text-xl opacity-90 mb-8">
                  At RecipeHub, we believe that cooking is more than just preparing meals—it's about creating memories, sharing traditions, and connecting with loved ones.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/contact" className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-primary shadow hover:bg-white/90">
                    Contact Us
                  </Link>
                  <Link to="/careers" className="inline-flex items-center justify-center rounded-md border border-white bg-transparent px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-white/10">
                    Join Our Team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-muted-foreground mb-6">
                RecipeHub was born from a simple idea: everyone deserves to enjoy delicious, home-cooked meals, regardless of their cooking experience or background.
              </p>
              <p className="text-lg text-muted-foreground">
                What started as a small collection of family recipes in 2018 has grown into a global community of food lovers sharing culinary traditions, innovative techniques, and the joy of cooking. Our mission is to inspire confidence in the kitchen and bring people together through the universal language of food.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://themewagon.github.io/delicious/img/bg-img/add.png" 
                  alt="Our kitchen" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">From Passion to Platform</h3>
                <p className="text-muted-foreground mb-6">
                  Our founder, Maria Johnson, started RecipeHub after noticing how many people struggled with cooking at home. Despite the abundance of recipes online, many were untested, complicated, or required specialty ingredients that were hard to find.
                </p>
                <p className="text-muted-foreground mb-6">
                  Maria assembled a team of culinary experts who shared her vision: to create a platform where every recipe is meticulously tested, clearly explained, and adaptable to different skill levels and dietary needs.
                </p>
                <p className="text-muted-foreground">
                  Today, RecipeHub serves millions of home cooks worldwide, with a database of over 10,000 tested recipes, step-by-step videos, and a vibrant community that shares tips, modifications, and cooking successes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Our Values</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-muted-foreground">
                These core principles guide everything we do at RecipeHub, from recipe development to community engagement.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl">🌱</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Sustainability</h3>
                <p className="text-muted-foreground">
                  We promote sustainable cooking practices and ingredients that are good for both people and the planet. Our recipes emphasize seasonal produce, reducing food waste, and environmentally conscious cooking methods.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Diversity</h3>
                <p className="text-muted-foreground">
                  We celebrate culinary traditions from around the world and embrace diverse flavors and techniques. Food is a universal language that brings people together, and we're committed to representing global cuisines authentically.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl">💡</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Innovation</h3>
                <p className="text-muted-foreground">
                  We constantly explore new ideas and approaches to cooking, while respecting traditional methods. Our test kitchen experiments with techniques and flavor combinations to bring fresh inspiration to home cooks.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Inclusivity</h3>
                <p className="text-muted-foreground">
                  We believe everyone should have access to delicious food, regardless of dietary restrictions or cooking experience. Our recipes include options for various dietary needs and skill levels.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Reliability</h3>
                <p className="text-muted-foreground">
                  Every recipe on RecipeHub is thoroughly tested to ensure it works in home kitchens. We believe in clear instructions, accurate timing, and consistent results that build confidence in cooking.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl">❤️</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Community</h3>
                <p className="text-muted-foreground">
                  We foster a supportive community where home cooks can share their experiences, ask questions, and celebrate successes. Cooking is better when shared with others who appreciate good food.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-muted-foreground">
                Our diverse team of culinary experts brings passion, creativity, and expertise to RecipeHub every day.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="group">
                  <div className="relative overflow-hidden rounded-lg mb-6">
                    <img 
                      src={member.image || "/placeholder.svg"} 
                      alt={member.name} 
                      className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <div className="flex justify-center gap-4">
                          <a href={`https://instagram.com/${member.social.instagram}`} className="text-white hover:text-primary-foreground" target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-5 w-5" />
                          </a>
                          <a href={`https://twitter.com/${member.social.twitter}`} className="text-white hover:text-primary-foreground" target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-5 w-5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">What Our Community Says</h2>
              <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
              <p className="text-lg opacity-90">
                Don't just take our word for it—hear from the home cooks who use RecipeHub every day.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={testimonial.image || "/placeholder.svg"} 
                      alt={testimonial.name} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-sm opacity-90">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={i < testimonial.rating ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="italic">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-muted-foreground">
                From humble beginnings to a global cooking community—here's how RecipeHub has evolved over the years.
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'} md:justify-between`}>
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                    
                    {/* Content */}
                    <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8 text-right' : 'md:pl-8 text-left'}`}>
                      <div className="bg-muted p-6 rounded-lg shadow-sm">
                        <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full mb-2">
                          {milestone.year}
                        </span>
                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-muted">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-muted-foreground">
                Have questions, feedback, or just want to say hello? We'd love to hear from you!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="bg-white p-8 rounded-lg shadow-sm h-full">
                  <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Our Location</h4>
                        <p className="text-muted-foreground">123 Culinary Street, Foodie District</p>
                        <p className="text-muted-foreground">San Francisco, CA 94103</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Email Us</h4>
                        <p className="text-muted-foreground">hello@recipehub.com</p>
                        <p className="text-muted-foreground">support@recipehub.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Call Us</h4>
                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                        <p className="text-muted-foreground">Mon-Fri, 9am-5pm PT</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="font-medium mb-4">Follow Us</h4>
                    <div className="flex gap-4">
                      <a href="https://instagram.com/recipehub" className="bg-muted p-3 rounded-full hover:bg-primary hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a href="https://facebook.com/recipehub" className="bg-muted p-3 rounded-full hover:bg-primary hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a href="https://twitter.com/recipehub" className="bg-muted p-3 rounded-full hover:bg-primary hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
                  
                  <form className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                        <input
                          type="text"
                          id="name"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          id="email"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Subject"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                      <textarea
                        id="message"
                        rows={5}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Your message"
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 w-full"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Cooking Community</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Sign up today to access thousands of recipes, save your favorites, and connect with fellow food lovers around the world.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup" className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-primary shadow hover:bg-white/90">
                Sign Up Free
              </Link>
              <Link to="/recipes" className="inline-flex items-center justify-center rounded-md border border-white bg-transparent px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-white/10">
                Explore Recipes
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl">🍽️</span>
                <span className="font-bold">RecipeHub</span>
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">
                Discover, save, and share your favorite recipes from around the world.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Explore</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/recipes" className="text-muted-foreground hover:text-foreground">
                    All Recipes
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="text-muted-foreground hover:text-foreground">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/popular" className="text-muted-foreground hover:text-foreground">
                    Popular
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} RecipeHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;
