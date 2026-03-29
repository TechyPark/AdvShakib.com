import React, { useState } from 'react';
import { X, Send, User, Mail, Phone, Briefcase, Calendar, FileText, Target, CheckCircle2, Loader2, Landmark, Shield, Gavel } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface IntakeFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const LEGAL_AREAS = [
  { id: 'criminal', label: 'Criminal Defense', icon: <Shield className="w-4 h-4" />, description: 'Penal Code, CrPC, ACC, Money Laundering' },
  { id: 'corporate', label: 'Corporate Law', icon: <Briefcase className="w-4 h-4" />, description: 'Companies Act, RJSC, BSEC, FDI' },
  { id: 'taxation', label: 'Taxation & Customs', icon: <Landmark className="w-4 h-4" />, description: 'Income Tax Act 2023, VAT & SD Act 2012, NBR' },
];

export function IntakeForm({ isOpen, onClose }: IntakeFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    issue: '',
    date: '',
    documentation: '',
    outcome: '',
    tin: '', // Tax Identification Number
    rjsc: '', // RJSC Registration Number
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-legal-navy/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-legal-paper w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-legal-gold/20 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-legal-navy p-6 text-white flex items-center justify-between relative">
          <Gavel className="absolute -right-4 -top-4 w-24 h-24 text-white/5 rotate-12" />
          <div className="relative z-10">
            <h2 className="text-2xl font-serif italic text-legal-gold">Consultation Intake Form</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-medium">Chambers of Advocate Shakib Jubayer</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10"
          >
            <X className="w-6 h-6 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {isSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-200">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-legal-navy">Inquiry Received</h3>
                <p className="text-sm text-legal-navy/60 max-w-md mx-auto">
                  Your legal brief has been securely transmitted to <span className="text-legal-gold font-bold">contact@advshakib.com</span>. Advocate Jubayer's office will review the merits of your case and contact you shortly.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-legal-navy text-legal-gold rounded-xl font-bold hover:bg-legal-navy/90 transition-all shadow-lg"
              >
                Return to Chambers
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Progress Bar */}
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div 
                    key={s}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-all duration-500",
                      step >= s ? "bg-legal-gold" : "bg-legal-gold/10"
                    )}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-legal-gold border-b border-legal-gold/10 pb-2">Client Identification</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-legal-navy/60 ml-1">Full Legal Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-legal-gold" />
                            <input 
                              required
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="e.g. Mohammad Rahim"
                              className="w-full bg-white border border-legal-gold/20 rounded-xl px-11 py-3 text-sm focus:ring-2 focus:ring-legal-gold/30 focus:border-legal-gold outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-legal-navy/60 ml-1">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-legal-gold" />
                            <input 
                              required
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="rahim@example.com"
                              className="w-full bg-white border border-legal-gold/20 rounded-xl px-11 py-3 text-sm focus:ring-2 focus:ring-legal-gold/30 focus:border-legal-gold outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-legal-navy/60 ml-1">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-legal-gold" />
                            <input 
                              required
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+880 1XXX-XXXXXX"
                              className="w-full bg-white border border-legal-gold/20 rounded-xl px-11 py-3 text-sm focus:ring-2 focus:ring-legal-gold/30 focus:border-legal-gold outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-legal-navy/60 ml-1">TIN (Optional for Tax Matters)</label>
                          <div className="relative">
                            <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-legal-gold" />
                            <input 
                              name="tin"
                              value={formData.tin}
                              onChange={handleChange}
                              placeholder="12-digit TIN"
                              className="w-full bg-white border border-legal-gold/20 rounded-xl px-11 py-3 text-sm focus:ring-2 focus:ring-legal-gold/30 focus:border-legal-gold outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-legal-gold border-b border-legal-gold/10 pb-2">Legal Jurisdiction & Domain</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {LEGAL_AREAS.map((area) => (
                          <button
                            key={area.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, area: area.id })}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                              formData.area === area.id 
                                ? "bg-legal-navy text-white border-legal-navy shadow-lg" 
                                : "bg-white text-legal-navy border-legal-gold/20 hover:border-legal-gold/50"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              formData.area === area.id ? "bg-legal-gold text-legal-navy" : "bg-legal-gold/10 text-legal-gold"
                            )}>
                              {area.icon}
                            </div>
                            <div>
                              <p className="text-sm font-bold">{area.label}</p>
                              <p className={cn(
                                "text-[10px]",
                                formData.area === area.id ? "text-white/60" : "text-legal-navy/50"
                              )}>{area.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-legal-gold border-b border-legal-gold/10 pb-2">Case Particulars</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-legal-navy/60 ml-1">Nature of Legal Issue</label>
                          <div className="relative">
                            <Gavel className="absolute left-4 top-4 w-4 h-4 text-legal-gold" />
                            <textarea 
                              required
                              name="issue"
                              value={formData.issue}
                              onChange={handleChange}
                              placeholder="Please describe the facts of your case, including any relevant sections of the Penal Code or Companies Act..."
                              className="w-full bg-white border border-legal-gold/20 rounded-xl px-11 py-3 text-sm focus:ring-2 focus:ring-legal-gold/30 focus:border-legal-gold outline-none transition-all h-32 resize-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-legal-navy/60 ml-1">Relevant Dates / Deadlines</label>
                            <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-legal-gold" />
                              <input 
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                placeholder="e.g. Date of NBR Notice"
                                className="w-full bg-white border border-legal-gold/20 rounded-xl px-11 py-3 text-sm focus:ring-2 focus:ring-legal-gold/30 focus:border-legal-gold outline-none transition-all"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-legal-navy/60 ml-1">Desired Outcome</label>
                            <div className="relative">
                              <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-legal-gold" />
                              <input 
                                required
                                name="outcome"
                                value={formData.outcome}
                                onChange={handleChange}
                                placeholder="e.g. Quashment of proceedings"
                                className="w-full bg-white border border-legal-gold/20 rounded-xl px-11 py-3 text-sm focus:ring-2 focus:ring-legal-gold/30 focus:border-legal-gold outline-none transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-legal-navy/60 ml-1">Existing Documentation (Description)</label>
                          <div className="relative">
                            <FileText className="absolute left-4 top-4 w-4 h-4 text-legal-gold" />
                            <textarea 
                              name="documentation"
                              value={formData.documentation}
                              onChange={handleChange}
                              placeholder="List any notices, contracts, or court orders in your possession..."
                              className="w-full bg-white border border-legal-gold/20 rounded-xl px-11 py-3 text-sm focus:ring-2 focus:ring-legal-gold/30 focus:border-legal-gold outline-none transition-all h-24 resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-legal-gold/10">
                <button
                  type="button"
                  onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                  className="px-6 py-2 text-sm font-bold text-legal-navy/60 hover:text-legal-navy transition-colors"
                >
                  {step === 1 ? 'Cancel' : 'Back'}
                </button>
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    disabled={step === 2 && !formData.area}
                    className="px-8 py-3 bg-legal-navy text-legal-gold rounded-xl font-bold hover:bg-legal-navy/90 transition-all shadow-lg disabled:opacity-50"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-legal-gold text-legal-navy rounded-xl font-bold hover:bg-legal-gold/90 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Inquiry
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
