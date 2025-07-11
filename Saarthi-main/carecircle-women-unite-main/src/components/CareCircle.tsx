import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ChatRoom from './ChatRoom';
import heroImage from '@/assets/care-circle-hero.jpg';
import pregnancyImage from '@/assets/pregnancy-support.jpg';
import wellnessImage from '@/assets/wellness-support.jpg';
import anxietyImage from '@/assets/anxiety-support.jpg';

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgImage?: string;
  chatPreview: string[];
  initialMessages: Array<{
    id: number;
    user: string;
    message: string;
    time: string;
    isAnonymous?: boolean;
  }>;
}

const CareCircle: React.FC = () => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  const supportGroups: SupportGroup[] = [
    {
      id: 'pregnancy',
      name: '🍼 Pregnancy Talks',
      description: 'Ask anything — nausea, fear, joy, miscarriage.',
      icon: '🍼',
      color: '#8B4513',
      bgImage: pregnancyImage,
      chatPreview: [
        '👩‍🍼: "I\'m 7 weeks pregnant and scared..."',
        '🤱: "Sending hugs. Journaling helped me."',
        '👩‍⚕️: "Track vitals in MediVault + rest."'
      ],
      initialMessages: [
        { id: 1, user: 'PregnancyMom', message: "I'm 7 weeks pregnant and scared of miscarrying again.", time: '10:30 AM', isAnonymous: true },
        { id: 2, user: 'SupportiveMom', message: 'Sending hugs. I journaled daily & it helped me through my fears.', time: '10:32 AM', isAnonymous: true },
        { id: 3, user: 'Dr. Sarah', message: 'Track your vitals in MediVault + get plenty of rest. We\'re here for you.', time: '10:35 AM' }
      ]
    },
    {
      id: 'pcos',
      name: '🩺 PCOS Warriors',
      description: 'Hormonal health support, period tracking, diet plans.',
      icon: '🩺',
      color: '#D2691E',
      bgImage: wellnessImage,
      chatPreview: [
        '🌸: "PCOS is ruining my mood and face."',
        '🍵: "Drink spearmint tea daily."',
        '👩‍⚕️: "Add logs to MediVault for analysis."'
      ],
      initialMessages: [
        { id: 1, user: 'PCOSWarrior', message: 'PCOS is ruining my mood and face. Any tips?', time: '9:15 AM', isAnonymous: true },
        { id: 2, user: 'HerbalHelper', message: 'Drink spearmint tea daily. Avoid dairy & sugar - it really helped me!', time: '9:18 AM', isAnonymous: true },
        { id: 3, user: 'Dr. Maria', message: 'Add cycle logs to MediVault for pattern analysis. Happy to help review.', time: '9:20 AM' }
      ]
    },
    {
      id: 'ttc',
      name: '👶 Trying to Conceive (TTC)',
      description: 'IVF, grief, fertility, ovulation — all welcome.',
      icon: '👶',
      color: '#A0522D',
      chatPreview: [
        '😔: "2nd IVF failed. Don\'t know how to breathe."',
        '❤️: "Same here. Want to DM and cry together?"',
        '👩‍⚕️: "Let\'s schedule a call. Don\'t bottle it up."'
      ],
      initialMessages: [
        { id: 1, user: 'HopefulMom', message: '2nd IVF failed. Don\'t know how to breathe right now.', time: '2:45 PM', isAnonymous: true },
        { id: 2, user: 'TTCSister', message: 'Same here last month. Want to DM and cry together? You\'re not alone.', time: '2:47 PM', isAnonymous: true },
        { id: 3, user: 'Counselor Lisa', message: 'Let\'s schedule a call. Please don\'t bottle it up. Grief is part of the journey.', time: '2:50 PM' }
      ]
    },
    {
      id: 'lone',
      name: '🧍‍♀️ Lone Liver Club',
      description: 'Living solo in PGs, hostels, or far from home?',
      icon: '🧍‍♀️',
      color: '#8B4513',
      chatPreview: [
        '😩: "Moved to Delhi alone. Feel numb."',
        '🎧: "Let\'s do a 9PM audio check-in."',
        '🧘: "Practice 5-4-3-2-1 grounding."'
      ],
      initialMessages: [
        { id: 1, user: 'DelhiNewbie', message: 'Moved to Delhi alone for work. Feel numb every evening.', time: '7:30 PM', isAnonymous: true },
        { id: 2, user: 'MumbaiSolo', message: 'Let\'s do a 9PM audio check-in. I\'m in Mumbai but same boat!', time: '7:32 PM', isAnonymous: true },
        { id: 3, user: 'MindfulMentor', message: 'Practice 5-4-3-2-1 grounding. Trust me, it helps with loneliness.', time: '7:35 PM', isAnonymous: true }
      ]
    },
    {
      id: 'menopause',
      name: '🌼 Menopause & Midlife Lounge',
      description: 'For hot flashes, brain fog, mood swings, and YOU.',
      icon: '🌼',
      color: '#CD853F',
      chatPreview: [
        '🔥: "Sweating all night. Help?"',
        '👵: "Try black cohosh + no coffee after 6."',
        '🩺: "Track patterns in MediVault."'
      ],
      initialMessages: [
        { id: 1, user: 'NightSweats', message: 'Sweating all night, can\'t sleep. Anyone else?', time: '11:20 PM', isAnonymous: true },
        { id: 2, user: 'ExperiencedLady', message: 'Try black cohosh supplement + no coffee after 6 PM. Game changer!', time: '11:22 PM', isAnonymous: true },
        { id: 3, user: 'Dr. Patricia', message: 'Track these patterns in MediVault. Want a demo of the symptom tracker?', time: '11:25 PM' }
      ]
    },
    {
      id: 'anxiety',
      name: '😔 Anxiety Anonymous',
      description: 'Panic attacks, stress, breathlessness? Start here.',
      icon: '😔',
      color: '#A0522D',
      bgImage: anxietyImage,
      chatPreview: [
        '😰: "I\'m shaking before my presentation."',
        '🙏: "Box breathing helped me last week."',
        '🧠: "Here\'s a calming audio. Tagging counselor."'
      ],
      initialMessages: [
        { id: 1, user: 'AnxiousAtWork', message: 'I\'m shaking before my big presentation tomorrow. Help?', time: '6:45 PM', isAnonymous: true },
        { id: 2, user: 'BreathingBuddy', message: 'Box breathing helped me last week. Try /voice calm command.', time: '6:47 PM', isAnonymous: true },
        { id: 3, user: 'TherapyHelper', message: 'Here\'s a calming audio link. Also tagging our counselor now.', time: '6:50 PM', isAnonymous: true }
      ]
    },
    {
      id: 'diagnosis',
      name: '🧬 Diagnosis Den',
      description: 'Newly diagnosed? Don\'t be scared. Ask us.',
      icon: '🧬',
      color: '#8B4513',
      chatPreview: [
        '😢: "Just diagnosed with hypothyroid."',
        '🍽: "Avoid gluten, add selenium-rich food."',
        '👩‍⚕️: "Log labs in MediVault."'
      ],
      initialMessages: [
        { id: 1, user: 'NewlyDiagnosed', message: 'Just diagnosed with hypothyroid. What do I do now?', time: '3:15 PM', isAnonymous: true },
        { id: 2, user: 'ThyroidSister', message: 'Avoid gluten and soy. Add selenium-rich foods like Brazil nuts.', time: '3:18 PM', isAnonymous: true },
        { id: 3, user: 'Dr. Jennifer', message: 'Log your labs in MediVault. I\'ll help you read and understand them.', time: '3:20 PM' }
      ]
    },
    {
      id: 'hq',
      name: '❤️ CareCircle HQ',
      description: 'Free zone. Say anything. Be real.',
      icon: '❤️',
      color: '#CD853F',
      chatPreview: [
        '"Best ways to tell manager about endometriosis?"',
        '"Going through breakup + iron deficiency."',
        '"Need a friend. That\'s all."'
      ],
      initialMessages: [
        { id: 1, user: 'WorkingWoman', message: 'Best ways to tell my manager about my endometriosis without TMI?', time: '1:30 PM', isAnonymous: true },
        { id: 2, user: 'DoubleStruggles', message: 'Going through a breakup AND just found out I have iron deficiency. Tips?', time: '1:45 PM', isAnonymous: true },
        { id: 3, user: 'JustNeedSupport', message: 'Not looking for advice. Just need a friend. That\'s all.', time: '2:00 PM', isAnonymous: true }
      ]
    }
  ];

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const openChatRoom = (groupId: string) => {
    setActiveRoom(groupId);
  };

  const closeChatRoom = () => {
    setActiveRoom(null);
  };

  const activeGroup = supportGroups.find(group => group.id === activeRoom);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            filter: 'brightness(0.7)'
          }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            CareCircle
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90">
            Peer & Emotional Support Hub
          </p>
          <p className="text-lg mb-8 opacity-80">
            "A judgment-free space where women connect, share, and heal — together."
          </p>
          <Button 
            onClick={() => scrollToSection('support-groups')}
            size="lg"
            className="bg-care-accent hover:bg-care-accent/90 text-white px-8 py-3 text-lg"
          >
            Join a Support Group
          </Button>
        </div>
      </section>

      {/* Support Groups Section */}
      <section id="support-groups" className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Real Support Groups
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join real-time conversations with women who understand your journey. 
            Anonymous mode available in all rooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportGroups.map((group) => (
            <Card 
              key={group.id}
              className="p-6 h-80 flex flex-col hover:shadow-[var(--shadow-warm)] transition-all duration-300 cursor-pointer transform hover:scale-105 bg-card border-none"
              onClick={() => openChatRoom(group.id)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white"
                  style={{ backgroundColor: group.color }}
                >
                  {group.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-foreground">
                    {group.name}
                  </h3>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mb-4">
                {group.description}
              </p>

              <div className="space-y-2">
                {group.chatPreview.map((preview, index) => (
                  <div 
                    key={index}
                    className="text-xs p-2 rounded bg-care-soft text-care-deep"
                  >
                    {preview}
                  </div>
                ))}
              </div>

              <Button 
                className="w-full mt-auto text-xs bg-care-accent hover:bg-care-accent/90 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  openChatRoom(group.id);
                }}
              >
                Join Conversation
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Smart Commands Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-care-soft to-care-warm relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-care-accent rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-care-deep rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-care-accent/50 rounded-full"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-care-deep mb-4">
              ✨ Smart Commands
            </h2>
            <p className="text-lg text-care-deep/80 max-w-2xl mx-auto">
              Powerful shortcuts to get help instantly. Just type these commands in any chat room.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                command: '/askexpert', 
                description: 'Ping online counselor or gynecologist',
                icon: '👩‍⚕️',
                gradient: 'from-rose-100 to-pink-100'
              },
              { 
                command: '/reminder Iron 9AM', 
                description: 'Add medicine alert',
                icon: '⏰',
                gradient: 'from-blue-100 to-cyan-100'
              },
              { 
                command: '/log mood Sad', 
                description: 'Store in MediVault for pattern tracking',
                icon: '📝',
                gradient: 'from-purple-100 to-violet-100'
              },
              { 
                command: '/hide identity', 
                description: 'Enable Anonymous Mode',
                icon: '🔒',
                gradient: 'from-amber-100 to-yellow-100'
              },
              { 
                command: '/circle TTC', 
                description: 'Switch support group',
                icon: '🔄',
                gradient: 'from-green-100 to-emerald-100'
              },
              { 
                command: '/connect NGO', 
                description: 'Auto-request to nearest listed NGO',
                icon: '🤝',
                gradient: 'from-orange-100 to-red-100'
              }
            ].map((item, index) => (
              <Card 
                key={item.command} 
                className={`p-6 bg-gradient-to-br ${item.gradient} border-none hover:shadow-[var(--shadow-warm)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <code className="text-care-deep font-mono text-sm font-bold bg-white/60 px-2 py-1 rounded">
                      {item.command}
                    </code>
                  </div>
                </div>
                <p className="text-sm text-care-deep/80 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-white/80 px-6 py-3 rounded-full shadow-md">
              <span className="text-sm font-medium text-care-deep">💡 Pro tip:</span>
              <span className="text-sm text-care-deep/80">Commands work in all chat rooms!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Room Modal */}
      {activeGroup && (
        <ChatRoom
          roomName={activeGroup.name}
          description={activeGroup.description}
          isOpen={!!activeRoom}
          onClose={closeChatRoom}
          initialMessages={activeGroup.initialMessages}
          roomColor={activeGroup.color}
        />
      )}
    </div>
  );
};

export default CareCircle;