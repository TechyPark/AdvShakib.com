import { useState, useRef, useEffect } from 'react';
import { Scale, Shield, Landmark, Send, User, Bot, Loader2, Gavel, FileText, Briefcase, PlusCircle, Globe, ChevronRight, Menu, X as CloseIcon, Facebook, Mail, Phone, MapPin, Camera, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { chatWithAdvocate, Message } from './services/legalService';
import { motion, AnimatePresence } from 'motion/react';
import { IntakeForm } from './components/IntakeForm';
import { translations, Language } from './lib/translations';
import { generateLegalVisuals } from './services/imageService';

const QUICK_PROMPTS = [
  {
    id: 'criminal',
    title: 'Criminal/Corporate Crossover',
    icon: <Shield className="w-4 h-4" />,
    prompt: "Advocate Jubayer, the Anti-Corruption Commission (ACC) has just frozen the bank accounts of my company's Managing Director under suspicion of money laundering. We need to file for immediate relief. What is our fastest route under the CrPC, and how do we protect the company's daily operations?"
  },
  {
    id: 'taxation',
    title: 'Taxation Challenge',
    icon: <Landmark className="w-4 h-4" />,
    prompt: "The NBR has issued a massive, arbitrary VAT assessment on our manufacturing plant under the VAT & SD Act 2012. I want to challenge this in the High Court via a writ petition rather than going to the Appellate Tribunal. What constitutional grounds can we argue to bypass the tribunal?"
  },
  {
    id: 'corporate',
    title: 'Corporate Drafting',
    icon: <FileText className="w-4 h-4" />,
    prompt: "Please draft a highly protective indemnification clause for an upcoming Joint Venture Agreement between our local Bangladeshi tech firm and a foreign investor, ensuring we are protected from their pre-existing tax liabilities."
  }
];

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGeneratingVisuals, setIsGeneratingVisuals] = useState(false);
  const [visuals, setVisuals] = useState<{ hero?: string; portrait?: string }>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;
    setIsChatOpen(true);
    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAdvocate(newMessages);
      setMessages([...newMessages, { role: 'model', content: response || "I apologize, but I am unable to provide counsel at this moment. Please try again." }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages([...newMessages, { role: 'model', content: "An error occurred while processing your request. As a legal professional, I must ensure the integrity of our communication. Please retry." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateVisuals = async () => {
    setIsGeneratingVisuals(true);
    try {
      const heroPrompt = lang === 'bn' 
        ? "A modern, high-end legal office in Dhaka, Bangladesh. The interior features luxury furniture with subtle Bengali cultural elements like Nakshi Kantha wall art and traditional brass pottery. View of Dhaka city skyline at dusk through large windows. Gold and navy accents."
        : "A high-end legal office in Dhaka with a view of the city skyline at dusk, luxury interior, gold and navy accents";
      
      const portraitPrompt = lang === 'bn'
        ? "A professional portrait of a distinguished South Asian male advocate wearing a formal navy blue Mujib coat over a white Panjabi. He is standing in a prestigious law library with gold-accented bookshelves. Formidable, sharp, and culturally elegant presence."
        : "A professional portrait of a distinguished South Asian male advocate in a navy blue suit, standing in a prestigious law library with gold-accented bookshelves, formidable and sharp presence";

      const heroImg = await generateLegalVisuals(heroPrompt, "16:9");
      const portraitImg = await generateLegalVisuals(portraitPrompt, "1:1");
      
      setVisuals({
        hero: heroImg || undefined,
        portrait: portraitImg || undefined
      });
    } catch (error) {
      console.error("Failed to generate visuals:", error);
    } finally {
      setIsGeneratingVisuals(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-legal-paper selection:bg-legal-gold/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-legal-gold/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-legal-gold" />
            <div>
              <h1 className="text-xl font-serif font-bold text-legal-navy leading-none">{t.hero.title}</h1>
              <p className="text-[9px] uppercase tracking-[0.2em] text-legal-gold font-bold mt-1">{t.hero.subtitle}</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#about" className="text-xs font-bold uppercase tracking-widest text-legal-navy/70 hover:text-legal-gold transition-colors">{t.nav.about}</a>
            <a href="#practice" className="text-xs font-bold uppercase tracking-widest text-legal-navy/70 hover:text-legal-gold transition-colors">{t.nav.practice}</a>
            <a href="#contact" className="text-xs font-bold uppercase tracking-widest text-legal-navy/70 hover:text-legal-gold transition-colors">{t.nav.contact}</a>
            <button 
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-legal-gold/20 text-[10px] font-bold uppercase tracking-tighter text-legal-navy hover:bg-legal-gold/10 transition-all"
            >
              <Globe className="w-3 h-3 text-legal-gold" />
              {lang === 'en' ? 'বাংলা' : 'English'}
            </button>
            <button 
              onClick={() => setIsIntakeOpen(true)}
              className="bg-legal-navy text-legal-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-legal-navy/90 transition-all shadow-lg shadow-legal-navy/10"
            >
              {t.nav.consultation}
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2 text-legal-navy" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <CloseIcon /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 z-40 bg-white pt-24 px-6"
          >
            <div className="flex flex-col gap-6 text-center">
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif italic text-legal-navy">{t.nav.about}</a>
              <a href="#practice" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif italic text-legal-navy">{t.nav.practice}</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif italic text-legal-navy">{t.nav.contact}</a>
              <button 
                onClick={() => { setLang(lang === 'en' ? 'bn' : 'en'); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 text-legal-gold font-bold"
              >
                <Globe className="w-4 h-4" /> {lang === 'en' ? 'বাংলা' : 'English'}
              </button>
              <button 
                onClick={() => { setIsIntakeOpen(true); setIsMobileMenuOpen(false); }}
                className="bg-legal-navy text-legal-gold py-4 rounded-2xl font-bold uppercase tracking-widest"
              >
                {t.nav.consultation}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-legal-navy">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={visuals.hero || "https://picsum.photos/seed/legal-dhaka/1920/1080?grayscale"} 
            alt="Dhaka Legal" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-legal-navy via-legal-navy/80 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-legal-gold/10 border border-legal-gold/20 text-legal-gold text-[10px] font-bold uppercase tracking-[0.3em]">
              <Shield className="w-3 h-3" /> {t.hero.subtitle}
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight">
              {t.hero.title}
            </h2>
            <p className="text-lg text-white/70 max-w-xl leading-relaxed font-light">
              {t.hero.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => setIsIntakeOpen(true)}
                className="bg-legal-gold text-legal-navy px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-legal-gold/10 flex items-center gap-3"
              >
                {t.hero.cta} <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-3"
              >
                <Bot className="w-5 h-5 text-legal-gold" /> {t.hero.aiCta}
              </button>
              {!visuals.hero && (
                <button 
                  onClick={generateVisuals}
                  disabled={isGeneratingVisuals}
                  className="bg-white/5 backdrop-blur-sm text-white/80 border border-white/10 px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  <Camera className="w-5 h-5 text-legal-gold" /> {isGeneratingVisuals ? t.hero.generating : t.hero.generateVisuals}
                </button>
              )}
            </div>
          </motion.div>
 
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden lg:block relative"
          >
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden border-2 border-legal-gold/30 shadow-2xl relative group">
              <img 
                src={visuals.portrait || "https://picsum.photos/seed/lawyer-portrait/800/1000"} 
                alt="Advocate Shakib Jubayer" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-legal-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-3xl shadow-2xl border border-legal-gold/10 max-w-[280px]">
              <Gavel className="w-10 h-10 text-legal-gold mb-4" />
              <p className="text-sm italic font-serif text-legal-navy leading-relaxed">
                "Justice is not just a goal, but a strategic pursuit of truth through the letter of the law."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://picsum.photos/seed/court/400/500" className="rounded-3xl shadow-lg" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/books/400/500" className="rounded-3xl shadow-lg mt-12" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-legal-gold rounded-full flex items-center justify-center border-8 border-white shadow-2xl">
                <Scale className="w-12 h-12 text-legal-navy" />
              </div>
            </div>
            <div className="space-y-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-legal-gold">{t.about.title}</h3>
              <h2 className="text-4xl md:text-5xl font-serif text-legal-navy leading-tight italic">
                {t.hero.title}
              </h2>
              <p className="text-lg text-legal-navy/70 leading-relaxed">
                {t.about.description}
              </p>
              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-legal-navy border-b border-legal-gold/20 pb-2">{t.about.expertise}</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {['Penal Code (1860)', 'Companies Act (1994)', 'Income Tax Act (2023)', 'CrPC (1898)', 'Contract Act (1872)', 'VAT & SD Act (2012)'].map((law) => (
                    <div key={law} className="flex items-center gap-3 text-sm font-medium text-legal-navy/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-legal-gold" />
                      {law}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section id="practice" className="py-24 bg-legal-paper/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-legal-gold/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-legal-gold">{t.nav.practice}</h3>
            <h2 className="text-4xl md:text-5xl font-serif text-legal-navy italic">{t.practice.title}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { id: 'criminal', icon: <Shield />, title: t.practice.criminal.title, desc: t.practice.criminal.desc, color: 'bg-red-50' },
              { id: 'corporate', icon: <Briefcase />, title: t.practice.corporate.title, desc: t.practice.corporate.desc, color: 'bg-blue-50' },
              { id: 'taxation', icon: <Landmark />, title: t.practice.taxation.title, desc: t.practice.taxation.desc, color: 'bg-amber-50' },
            ].map((area) => (
              <motion.div 
                key={area.id}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[40px] border border-legal-gold/10 shadow-xl shadow-legal-navy/5 group transition-all"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:rotate-12", area.color)}>
                  <div className="text-legal-navy w-8 h-8">{area.icon}</div>
                </div>
                <h4 className="text-2xl font-serif text-legal-navy mb-4 italic">{area.title}</h4>
                <p className="text-sm text-legal-navy/60 leading-relaxed mb-8">
                  {area.desc}
                </p>
                <button 
                  onClick={() => setIsIntakeOpen(true)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-legal-gold hover:text-legal-navy transition-colors"
                >
                  Learn More <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-legal-gold">{t.testimonials.title}</h3>
            <h2 className="text-4xl md:text-5xl font-serif text-legal-navy italic">{t.testimonials.subtitle}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.testimonials.items.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-legal-paper/30 p-8 rounded-[32px] border border-legal-gold/10 relative group hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-legal-gold rounded-full flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-legal-navy" />
                </div>
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="w-3 h-3 bg-legal-gold rounded-full" />
                    ))}
                  </div>
                  <p className="text-sm italic text-legal-navy/80 leading-relaxed font-serif">
                    "{item.text}"
                  </p>
                </div>
                <div className="pt-6 border-t border-legal-gold/10">
                  <p className="text-sm font-bold text-legal-navy">{item.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-legal-gold font-bold mt-1">{item.case}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-legal-navy text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-legal-gold">{t.nav.contact}</h3>
                <h2 className="text-4xl md:text-5xl font-serif italic leading-tight">Secure Your Legal Future</h2>
                <p className="text-lg text-white/60 leading-relaxed max-w-md">
                  Professional consultation is the first step towards a strategic resolution. Contact our chambers today.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-legal-gold group-hover:text-legal-navy transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1">Email</p>
                    <p className="text-lg font-serif italic">{t.footer.contact}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-legal-gold group-hover:text-legal-navy transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1">Phone</p>
                    <p className="text-lg font-serif italic">+880 1XXX XXXXXX</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-legal-gold group-hover:text-legal-navy transition-all">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1">Chambers</p>
                    <p className="text-lg font-serif italic">{t.footer.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <a href="https://www.facebook.com/share/18cpJjSjNS/?mibextid=wwXIfr" target="_blank" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-legal-gold hover:text-legal-navy transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-10 text-legal-navy shadow-2xl">
              <h3 className="text-2xl font-serif italic mb-8 border-b border-legal-gold/20 pb-4">Direct Inquiry</h3>
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-legal-navy/40 ml-1">Name</label>
                    <input className="w-full bg-legal-paper/50 border border-legal-gold/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-legal-gold/30" placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-legal-navy/40 ml-1">Email</label>
                    <input className="w-full bg-legal-paper/50 border border-legal-gold/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-legal-gold/30" placeholder="Your Email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-legal-navy/40 ml-1">Message</label>
                  <textarea className="w-full bg-legal-paper/50 border border-legal-gold/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-legal-gold/30 h-32 resize-none" placeholder="Briefly describe your case..." />
                </div>
                <button 
                  onClick={() => setIsIntakeOpen(true)}
                  className="w-full bg-legal-navy text-legal-gold py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-legal-gold hover:text-legal-navy transition-all shadow-xl shadow-legal-navy/20"
                >
                  Submit Brief
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-legal-navy border-t border-white/5 py-12 text-center">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Scale className="w-6 h-6 text-legal-gold" />
            <h2 className="text-lg font-serif italic text-white">{t.hero.title}</h2>
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
            © {new Date().getFullYear()} {t.hero.title} • {t.footer.rights}
          </p>
        </div>
      </footer>

      {/* AI Chat Drawer */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-legal-paper z-[60] shadow-2xl border-l border-legal-gold/20 flex flex-col"
          >
            {/* Chat Header */}
            <div className="bg-legal-navy p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-legal-gold p-2 rounded-lg">
                  <Bot className="w-5 h-5 text-legal-navy" />
                </div>
                <div>
                  <h3 className="text-lg font-serif italic text-legal-gold">{t.nav.chat}</h3>
                  <p className="text-[9px] uppercase tracking-widest text-white/60">Advocate Shakib Jubayer AI</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-12 space-y-6">
                  <Scale className="w-12 h-12 text-legal-gold mx-auto opacity-20" />
                  <p className="text-lg font-serif italic text-legal-navy/40">{t.chat.welcome}</p>
                  <div className="grid gap-3">
                    {QUICK_PROMPTS.map(p => (
                      <button 
                        key={p.id} 
                        onClick={() => handleSend(p.prompt)}
                        className="text-left p-4 bg-white border border-legal-gold/10 rounded-2xl text-xs italic text-legal-navy/70 hover:border-legal-gold/40 transition-all"
                      >
                        {p.prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", msg.role === 'user' ? "bg-legal-gold" : "bg-legal-navy")}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-legal-gold" />}
                  </div>
                  <div className={cn("max-w-[85%] px-4 py-3 rounded-2xl shadow-sm text-sm", msg.role === 'user' ? "bg-legal-gold/10 text-legal-navy" : "bg-white text-legal-navy border border-legal-gold/10")}>
                    <div className="markdown-body">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-legal-navy/20" />
                  <div className="flex-1 bg-white h-12 rounded-2xl border border-legal-gold/10" />
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-6 bg-white border-t border-legal-gold/10">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder={t.chat.placeholder}
                  className="w-full bg-legal-paper/50 border border-legal-gold/20 rounded-2xl px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-legal-gold/30 h-20 resize-none"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-3 bottom-3 p-2 bg-legal-navy text-legal-gold rounded-xl hover:bg-legal-navy/90 disabled:opacity-50 transition-all"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[8px] text-center mt-3 uppercase tracking-widest text-legal-navy/40 font-bold">
                {t.chat.disclaimer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-legal-navy text-legal-gold rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 border-2 border-legal-gold/20"
        >
          <Bot className="w-8 h-8" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-legal-gold rounded-full animate-ping" />
        </button>
      )}

      {/* Intake Form Modal */}
      <IntakeForm isOpen={isIntakeOpen} onClose={() => setIsIntakeOpen(false)} />
    </div>
  );
}
