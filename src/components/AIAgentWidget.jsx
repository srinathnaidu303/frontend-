import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AIAgentWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I am your AI Assistant. I can help you book an appointment, find a specialty based on symptoms, or recommend alternative medicines.", isBot: true }
    ]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const userMsg = { text: inputText, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");

        // Simulate AI thinking and logic
        setTimeout(() => {
            const lowerInput = userMsg.text.toLowerCase();
            let botResponse = "I'm sorry, I didn't catch that. Could you try asking about booking an appointment, checking symptoms, or finding a medicine alternative?";
            let actionText = null;
            let actionLink = null;

            // Medicine alternative logic
            if (lowerInput.includes("medicine") || lowerInput.includes("alternative")) {
                const medicines = {
                    "tylenol": "Acetaminophen (Paracetamol)",
                    "advil": "Ibuprofen",
                    "amoxicillin": "Penicillin V (Please consult a doctor for antibiotics)",
                    "benadryl": "Cetirizine or Loratadine (non-drowsy alternatives)"
                };
                
                let foundMedicine = false;
                for (const [med, alt] of Object.entries(medicines)) {
                    if (lowerInput.includes(med)) {
                        botResponse = `If ${med} is not available, a good generic alternative is **${alt}**. However, please always consult your pharmacist or doctor before switching medications.`;
                        foundMedicine = true;
                        break;
                    }
                }

                if (!foundMedicine) {
                    botResponse = "It looks like you're asking for a medicine alternative. Could you specify which medicine you need an alternative for? (e.g., Tylenol, Advil, Benadryl)";
                }
            } 
            // Appointment / Symptom logic
            else if (lowerInput.includes("book") || lowerInput.includes("appointment") || lowerInput.includes("headache") || lowerInput.includes("pain") || lowerInput.includes("heart")) {
                
                let recommendation = "a General Physician";
                if (lowerInput.includes("headache") || lowerInput.includes("brain") || lowerInput.includes("migraine")) {
                    recommendation = "Neurology";
                } else if (lowerInput.includes("heart") || lowerInput.includes("chest") || lowerInput.includes("blood pressure")) {
                    recommendation = "Cardiology";
                } else if (lowerInput.includes("bone") || lowerInput.includes("joint") || lowerInput.includes("muscle") || lowerInput.includes("pain")) {
                    recommendation = "Orthopedics";
                } else if (lowerInput.includes("skin") || lowerInput.includes("hair") || lowerInput.includes("rash")) {
                    recommendation = "Dermatology";
                } else if (lowerInput.includes("child") || lowerInput.includes("baby") || lowerInput.includes("kid")) {
                    recommendation = "Pediatrics";
                }

                botResponse = `Based on your input, I recommend booking an appointment with ${recommendation}. Our specialists are ready to help!`;
                actionText = "View Doctors";
                actionLink = "/doctors";
            }

            setMessages(prev => [...prev, { text: botResponse, isBot: true, actionText, actionLink }]);
        }, 1000);
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, fontFamily: 'sans-serif' }}>
            {isOpen ? (
                <div style={{ width: '350px', height: '450px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #ddd' }}>
                    <div style={{ backgroundColor: '#2575fc', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '10px', height: '10px', backgroundColor: '#4caf50', borderRadius: '50%' }}></div>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>AI Medical Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }}>✖</button>
                    </div>

                    <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f9f9f9' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{ alignSelf: msg.isBot ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                                <div style={{ 
                                    padding: '10px 14px', 
                                    borderRadius: '15px', 
                                    backgroundColor: msg.isBot ? '#e0e0e0' : '#2575fc', 
                                    color: msg.isBot ? '#333' : 'white',
                                    fontSize: '14px',
                                    lineHeight: '1.4',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                }}>
                                    {msg.text}
                                </div>
                                {msg.actionText && (
                                    <button 
                                        onClick={() => { setIsOpen(false); navigate(msg.actionLink); }}
                                        style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', width: '100%', transition: 'background-color 0.2s', fontWeight: 'bold' }}
                                    >
                                        {msg.actionText}
                                    </button>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={{ padding: '15px', borderTop: '1px solid #ddd', backgroundColor: 'white', display: 'flex', gap: '8px' }}>
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about booking or medicine..."
                            style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none' }}
                        />
                        <button onClick={handleSend} style={{ padding: '10px 20px', backgroundColor: '#2575fc', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>Send</button>
                    </div>
                </div>
            ) : (
                <div 
                    onClick={() => setIsOpen(true)}
                    style={{ width: '65px', height: '65px', backgroundColor: '#2575fc', color: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(37, 117, 252, 0.4)', fontSize: '28px', transition: 'transform 0.3s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title="Chat with AI Agent"
                >
                    💬
                </div>
            )}
        </div>
    );
};

export default AIAgentWidget;
