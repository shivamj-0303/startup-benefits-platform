'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Button, Card, CardBody, Badge } from '@/components/ui';

export default function Home() {
  const [email, setEmail] = useState('');
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <motion.nav 
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BenefitsHub
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden py-20 px-4"
        style={{ opacity, scale }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Headline */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-4"
            >
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Exclusive Benefits
                </span>
                <br />
                <span className="text-gray-900">
                  for Growing Startups
                </span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                Access $500K+ in credits, tools, and perks from top companies. 
                Join 10,000+ startups saving money and scaling faster.
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link href="/register">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="group"
                  >
                    Start Saving Now
                    <motion.span
                      className="inline-block ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg">
                    View All Deals
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8"
            >
              {[
                { value: '$500K+', label: 'In Credits' },
                { value: '10K+', label: 'Startups' },
                { value: '50+', label: 'Partners' }
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Floating shapes */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ repeat: Infinity, duration: 4, delay: 1 }}
        />
      </motion.section>

      {/* Social Proof - Partner Logos */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-12 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500 mb-8">
            TRUSTED BY STARTUPS USING
          </p>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {['AWS', 'Stripe', 'GitHub', 'Notion', 'Figma', 'MongoDB'].map((partner, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {partner}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything Your Startup Needs
            </h2>
            <p className="text-xl text-gray-600">
              From cloud credits to productivity tools, we've got you covered
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '☁️',
                title: 'Cloud Infrastructure',
                description: 'Up to $100K in AWS, Google Cloud, and Azure credits',
                badge: 'Popular'
              },
              {
                icon: '💳',
                title: 'Payment Processing',
                description: 'Save on transaction fees with Stripe and PayPal credits',
                badge: 'New'
              },
              {
                icon: '🛠️',
                title: 'Development Tools',
                description: 'Free GitHub Enterprise, Vercel, and CI/CD platforms',
                badge: null
              },
              {
                icon: '📊',
                title: 'Analytics & Monitoring',
                description: 'Mixpanel, Amplitude, and Datadog pro plans included',
                badge: null
              },
              {
                icon: '💬',
                title: 'Communication',
                description: 'Slack, Zoom, and Notion workspace credits',
                badge: 'Popular'
              },
              {
                icon: '🎨',
                title: 'Design Tools',
                description: 'Figma, Canva Pro, and Adobe Creative Cloud access',
                badge: null
              }
            ].map((feature, i) => (
              <motion.div key={i} variants={scaleIn}>
                <Card hover className="h-full">
                  <CardBody className="space-y-4">
                    <div className="flex items-start justify-between">
                      <motion.div 
                        className="text-4xl"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        {feature.icon}
                      </motion.div>
                      {feature.badge && (
                        <Badge variant={feature.badge === 'Popular' ? 'info' : 'success'} size="sm">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start saving in 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Create Your Account',
                description: 'Sign up in 30 seconds with your work email. No credit card required.',
                icon: '✍️'
              },
              {
                step: '02',
                title: 'Browse Exclusive Deals',
                description: 'Access our curated marketplace of 50+ verified partner offers.',
                icon: '🔍'
              },
              {
                step: '03',
                title: 'Claim & Save',
                description: 'Activate deals instantly and start saving on essential tools.',
                icon: '🎉'
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="relative"
              >
                <div className="text-center space-y-4">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl font-bold mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {step.step}
                  </motion.div>
                  <motion.div 
                    className="text-5xl mb-4"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      delay: i * 0.3 
                    }}
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                
                {i < 2 && (
                  <motion.div
                    className="hidden md:block absolute top-8 -right-6 text-3xl text-gray-300"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials/Social Proof */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Founders Everywhere
            </h2>
            <p className="text-xl text-gray-600">
              See what startup founders are saying
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Saved us $50K in our first year. Absolutely essential for any early-stage startup.",
                author: "Sarah Chen",
                role: "CEO, TechFlow",
                avatar: "SC"
              },
              {
                quote: "The GitHub Enterprise deal alone was worth signing up. Everything else is a bonus!",
                author: "Mike Rodriguez",
                role: "CTO, DataSync",
                avatar: "MR"
              },
              {
                quote: "Cut our infrastructure costs by 60%. Can't imagine bootstrapping without this.",
                author: "Emily Watson",
                role: "Founder, CloudNest",
                avatar: "EW"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="h-full">
                  <CardBody className="space-y-4">
                    <div className="text-yellow-500 text-2xl">★★★★★</div>
                    <p className="text-gray-700 italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-20 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-12 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl font-bold text-white">
                Ready to Start Saving?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Join 10,000+ startups already saving money with exclusive benefits and deals
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="px-6 py-3 rounded-lg w-full sm:w-80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Link href={`/register?email=${email}`}>
                  <motion.button
                    className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started Free
                  </motion.button>
                </Link>
              </div>

              <p className="text-sm text-blue-100">
                No credit card required • Free forever • Cancel anytime
              </p>
            </div>

            {/* Animated background elements */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full opacity-20"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gray-900 text-gray-300 py-12 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg" />
                <span className="text-white font-bold text-xl">BenefitsHub</span>
              </div>
              <p className="text-sm">
                Exclusive benefits and deals for growing startups.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/deals" className="hover:text-white">Browse Deals</Link></li>
                <li><Link href="/register" className="hover:text-white">Get Started</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2026 BenefitsHub. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
