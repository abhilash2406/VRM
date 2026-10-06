import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Modal from 'react-modal';

/* ── Animations ── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
`;

/* ── Section Wrapper ── */
const SectionWrapper = styled.section`
  padding: 110px 0 100px;
  background: transparent;
  color: #f8fafc;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;

  /* Ambient Glows */
  &::before {
    content: '';
    position: absolute;
    top: 5%;
    left: -8%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 65%);
    pointer-events: none;
    animation: ${pulseGlow} 8s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 5%;
    right: -6%;
    width: 550px;
    height: 550px;
    background: radial-gradient(circle, rgba(0, 102, 255, 0.08) 0%, transparent 65%);
    pointer-events: none;
    animation: ${pulseGlow} 10s ease-in-out infinite reverse;
  }
`;

const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 2;
`;

/* ── Section Header ── */
const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 56px;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 50px;
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #00d4ff;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: 16px;

  i {
    font-size: 0.85rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.8px;
  line-height: 1.2;
  color: #ffffff;

  span {
    background: linear-gradient(90deg, #00d4ff, #38bdf8, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const SectionDesc = styled.p`
  color: #94a3b8;
  font-size: 1.15rem;
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.65;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

/* ── Category Filter Tabs ── */
const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 50px;
`;

const FilterButton = styled.button`
  padding: 10px 22px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid ${props => props.active ? '#00d4ff' : 'rgba(255, 255, 255, 0.1)'};
  background: ${props => props.active ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 102, 255, 0.2))' : '#071229'};
  color: ${props => props.active ? '#00d4ff' : '#cbd5e1'};
  box-shadow: ${props => props.active ? '0 0 20px rgba(0, 212, 255, 0.25)' : 'none'};

  &:hover {
    color: #ffffff;
    border-color: #00d4ff;
    transform: translateY(-2px);
  }
`;

/* ── Featured Hero Card ── */
const FeaturedCard = styled.div`
  background: #071229;
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 48px;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  cursor: pointer;
  transition: all 0.35s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(0, 212, 255, 0.05);

  &:hover {
    border-color: #00d4ff;
    transform: translateY(-4px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 35px rgba(0, 212, 255, 0.15);

    img {
      transform: scale(1.05);
    }
  }

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 340px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 50%, rgba(7, 18, 41, 0.7) 100%);
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;
  background: linear-gradient(135deg, #00d4ff, #0066ff);
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 4px 14px rgba(0, 212, 255, 0.4);
`;

const FeaturedBody = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 600px) {
    padding: 24px;
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 14px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  i {
    color: #00d4ff;
  }
`;

const CategoryTag = styled.span`
  color: #00d4ff !important;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FeaturedTitle = styled.h3`
  font-size: 1.85rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.3;
  margin-bottom: 14px;
  letter-spacing: -0.4px;

  @media (max-width: 600px) {
    font-size: 1.4rem;
  }
`;

const FeaturedExcerpt = styled.p`
  color: #cbd5e1;
  font-size: 1rem;
  line-height: 1.65;
  margin-bottom: 24px;
`;

const ReadMoreBtn = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #00d4ff;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.25s ease;

  i {
    transition: transform 0.25s ease;
  }

  ${FeaturedCard}:hover & i,
  article:hover & i {
    transform: translateX(6px);
  }
`;

/* ── Blog Grid ── */
const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 60px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const ArticleCard = styled.article`
  background: #071229;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(0, 212, 255, 0.4);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 212, 255, 0.1);

    img {
      transform: scale(1.06);
    }

    h4 {
      color: #00d4ff;
    }
  }
`;

const CardImageWrapper = styled.div`
  position: relative;
  height: 220px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
`;

const FloatingTag = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(7, 18, 41, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 212, 255, 0.35);
  color: #00d4ff;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
`;

const CardBody = styled.div`
  padding: 26px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const CardTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.4;
  margin-bottom: 10px;
  transition: color 0.25s ease;
`;

const CardExcerpt = styled.p`
  color: #94a3b8;
  font-size: 0.92rem;
  line-height: 1.6;
  margin-bottom: 20px;
  flex: 1;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
  margin-top: auto;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 1.5px solid #00d4ff;
  }

  span {
    font-size: 0.84rem;
    font-weight: 600;
    color: #e2e8f0;
  }
`;

/* ── Newsletter Subscription Box ── */
const NewsletterBox = styled.div`
  background: linear-gradient(135deg, rgba(10, 16, 51, 0.9), rgba(7, 18, 41, 0.95));
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: 24px;
  padding: 42px 48px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 212, 255, 0.06);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 32px 24px;
    text-align: center;
  }
`;

const NewsletterText = styled.div`
  h3 {
    font-size: 1.8rem;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 8px;
    letter-spacing: -0.4px;
  }

  p {
    color: #94a3b8;
    font-size: 0.98rem;
    margin: 0;
    line-height: 1.5;
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 12px;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  background: linear-gradient(135deg, #050a33 0%, #05081f 50%, #071229 100%);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 50px;
  padding: 14px 22px;
  color: #ffffff;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s ease;

  &:focus {
    border-color: #00d4ff;
    box-shadow: 0 0 16px rgba(0, 212, 255, 0.25);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const NewsletterButton = styled.button`
  background: linear-gradient(135deg, #00d4ff, #0066ff);
  color: #ffffff;
  border: none;
  border-radius: 50px;
  padding: 14px 28px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s ease;
  box-shadow: 0 4px 18px rgba(0, 212, 255, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 26px rgba(0, 212, 255, 0.6);
  }
`;

/* ── Modal Article View ── */
const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '840px',
    maxHeight: '85vh',
    padding: '0',
    border: '1px solid rgba(0, 212, 255, 0.3)',
    borderRadius: '24px',
    backgroundColor: '#071229',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 212, 255, 0.2)',
    overflowY: 'auto',
    zIndex: 1100,
    color: '#ffffff',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(10px)',
    zIndex: 1050,
  },
};

const ModalHero = styled.div`
  position: relative;
  height: 340px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, #071229 10%, transparent 80%);
  }
`;

const ModalCloseBtn = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(7, 18, 41, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.4);
  color: #00d4ff;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s ease;

  &:hover {
    background: #00d4ff;
    color: #071229;
    transform: scale(1.1);
  }
`;

const ModalContent = styled.div`
  padding: 36px 44px 48px;

  @media (max-width: 600px) {
    padding: 24px 20px 32px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.25;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
`;

const ProTipBox = styled.div`
  background: rgba(0, 212, 255, 0.08);
  border-left: 4px solid #00d4ff;
  border-radius: 0 12px 12px 0;
  padding: 18px 22px;
  margin: 28px 0;

  h5 {
    color: #00d4ff;
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    color: #cbd5e1;
    font-size: 0.95rem;
    margin: 0;
    line-height: 1.5;
  }
`;

const StoryText = styled.div`
  color: #cbd5e1;
  font-size: 1.05rem;
  line-height: 1.8;

  p {
    margin-bottom: 18px;
  }
`;

/* ── Articles Data ── */
const ARTICLES = [
  {
    id: 1,
    category: 'ROAD TRIPS',
    isFeatured: true,
    title: 'The Ultimate Coastal Highway Drive: Mumbai to Goa in a Ford Mustang GT',
    excerpt: 'Experience breathtaking cliffside curves, golden Arabian Sea sunsets, and the unmistakable roar of an American V8 along India’s most scenic coastal expressway.',
    date: 'Oct 04, 2026',
    readTime: '6 min read',
    author: {
      name: 'Rohan Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    },
    image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    content: [
      'Nothing beats the sensation of gripping a leather-wrapped steering wheel as the coastline stretches out toward the horizon. The new Mumbai to Goa expressway route blends panoramic coastal vistas with silky smooth stretches engineered for performance enthusiasts.',
      'Renting a performance machine like the Mustang GT turns a standard road trip into an unforgettable voyage. The active exhaust notes bouncing off cliffside passes at dusk provide pure automotive bliss.',
      'Along the way, quaint Konkan fishing villages offer fresh sea fare and warm hospitality, giving drivers the perfect opportunity to pause, take in ocean breezes, and prepare for the winding ascents ahead.',
    ],
    proTip: 'Plan your departure at 5:00 AM to beat toll junction queues and experience the mist clearing over the Western Ghats with clear roads.',
  },
  {
    id: 2,
    category: 'EV GUIDES',
    title: 'EV Road Tripping 101: Navigating Fast Superchargers Across India',
    excerpt: 'Smart route planning, fast DC charging speeds, battery preconditioning, and zero-emission luxury travel made simple.',
    date: 'Sep 28, 2026',
    readTime: '4 min read',
    author: {
      name: 'Priya Patel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    },
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: [
      'Modern electric vehicles in the DriveOnRyd fleet now boast ranges exceeding 450 km per charge. With the national fast-charging network expanding across arterial highways, an EV road trip is smoother and more affordable than ever.',
      'Charging stops along expressways have evolved into lifestyle plazas equipped with gourmet cafes, high-speed Wi-Fi, and lounge areas where a 20-minute top-up feels like a refreshing breather rather than an interruption.',
    ],
    proTip: 'Aim to charge between 15% and 80% state of charge (SoC) for maximum charging speed—modern battery management curves deliver peak speeds in this sweet spot.',
  },
  {
    id: 3,
    category: 'SUPERCAR REVIEWS',
    title: 'Top 7 Supercar Etiquette Tips for First-Time Renters',
    excerpt: 'Stepping into a Lamborghini or Ferrari? Master dual-clutch transmission, ground clearance lift systems, and dynamic drive modes with confidence.',
    date: 'Sep 18, 2026',
    readTime: '5 min read',
    author: {
      name: 'Aditya Roy',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    },
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: [
      'Renting an exotic supercar is an exhilarating milestone. Modern supercars are surprisingly friendly for everyday driving, but their low ground clearance, razor-sharp throttle mapping, and ceramic brakes require mindful handling.',
      'Before rolling out, always familiarize yourself with the hydraulic nose-lift switch on the center console. Speed humps and steep ramp gradients require slow approach angles at 45 degrees to safeguard the carbon fiber front splitter.',
    ],
    proTip: 'Always allow high-performance brake pads and dry-sump engine oil 5–8 minutes of normal driving to reach optimal operating temperatures before unleashing spirited acceleration.',
  },
  {
    id: 4,
    category: 'RENTAL TIPS',
    title: 'Self-Drive vs Chauffeur: Which Rental Fits Your Upcoming Journey?',
    excerpt: 'Whether you crave adrenaline behind the wheel or executive relaxation in the back seat, find the right format for corporate or leisure travel.',
    date: 'Sep 05, 2026',
    readTime: '3 min read',
    author: {
      name: 'Kavita Nair',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    },
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: [
      'Self-drive unlocks spontaneous detours, the pure thrill of open tarmac, and private conversations with family or friends. Our luxury sedans and sports cars come equipped with digital keys for seamless keyless pick-up.',
      'On the other hand, if your itinerary is packed with high-stakes business meetings or you have an intercity flight to catch after a grueling conference, our vetted professional chauffeurs allow you to work or rest in absolute peace.',
    ],
    proTip: 'For multi-city business trips, choose Chauffeur service for urban transit to eliminate parking stress, and switch to Self-Drive for weekend getaways.',
  },
  {
    id: 5,
    category: 'ROAD TRIPS',
    title: 'Monsoon Driving Guide: Taming Hill Stations with All-Wheel Drive',
    excerpt: 'Tackle wet hairpins, misty ghats, and mountain terrains safely with our AWD luxury SUV collection featuring terrain management.',
    date: 'Aug 22, 2026',
    readTime: '5 min read',
    author: {
      name: 'Rohan Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    },
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: [
      'Hill stations transform into verdant wonderlands during monsoon seasons. Waterfalls spill onto roadsides, and cool mist blankets winding ghat sections.',
      'Driving an AWD luxury SUV like the Land Rover Defender or Audi Q8 gives you the dual benefit of elevated ride height, intelligent torque vectoring across slipping wheels, and rain-sensing LED illumination.',
    ],
    proTip: 'When ascending or descending wet mountain slopes, use engine braking via paddle shifters to prevent continuous brake rotor heating and maintain steady traction.',
  },
  {
    id: 6,
    category: 'INNOVATION',
    title: 'Keyless & Digital Rentals: The Future of Frictionless Mobility',
    excerpt: 'How DriveOnRyd uses instant digital keys and NFC mobile unlocking to eliminate rental paperwork and counter queues forever.',
    date: 'Aug 11, 2026',
    readTime: '4 min read',
    author: {
      name: 'Priya Patel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    },
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: [
      'Standing in line at a car rental desk filling paper forms is now a thing of the past. DriveOnRyd integrates zero-knowledge identity verification with cryptographic digital vehicle keys.',
      'Once your booking is confirmed, your smartphone acts as your proximity key. Simply walk up to your assigned vehicle, tap to unlock, and push the engine start button.',
    ],
    proTip: 'Save your digital key to Apple Wallet or Google Wallet before heading into areas with limited cellular coverage for instant offline access.',
  },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const categories = ['ALL', 'ROAD TRIPS', 'SUPERCAR REVIEWS', 'EV GUIDES', 'RENTAL TIPS', 'INNOVATION'];

  const filteredArticles = activeCategory === 'ALL'
    ? ARTICLES
    : ARTICLES.filter(art => art.category === activeCategory);

  const featuredArticle = ARTICLES.find(art => art.isFeatured);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (subscriberEmail.trim()) {
      setIsSubscribed(true);
      setSubscriberEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <SectionWrapper id="blog">
      <Container>
        {/* Header */}
        <SectionHeader>
          <Badge>
            <i className="fas fa-newspaper"></i> Journal & Travel Guides
          </Badge>
          <SectionTitle>
            Stories for the <span>Road Ahead</span>
          </SectionTitle>
          <SectionDesc>
            Curated travel inspiration, supercar performance guides, electric mobility insights, and expert driving tips from our team.
          </SectionDesc>
        </SectionHeader>

        {/* Filter Tabs */}
        <FilterBar>
          {categories.map(cat => (
            <FilterButton
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'ALL' ? 'All Articles' : cat}
            </FilterButton>
          ))}
        </FilterBar>

        {/* Featured Story Banner (shown if All or Road Trips selected) */}
        {featuredArticle && (activeCategory === 'ALL' || activeCategory === featuredArticle.category) && (
          <FeaturedCard onClick={() => setSelectedArticle(featuredArticle)}>
            <FeaturedImageWrapper>
              <FeaturedBadge>Featured Story</FeaturedBadge>
              <img src={featuredArticle.image} alt={featuredArticle.title} />
            </FeaturedImageWrapper>
            <FeaturedBody>
              <ArticleMeta>
                <CategoryTag>{featuredArticle.category}</CategoryTag>
                <span><i className="far fa-calendar-alt"></i> {featuredArticle.date}</span>
                <span><i className="far fa-clock"></i> {featuredArticle.readTime}</span>
              </ArticleMeta>
              <FeaturedTitle>{featuredArticle.title}</FeaturedTitle>
              <FeaturedExcerpt>{featuredArticle.excerpt}</FeaturedExcerpt>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <AuthorInfo>
                  <img src={featuredArticle.author.avatar} alt={featuredArticle.author.name} />
                  <span>{featuredArticle.author.name}</span>
                </AuthorInfo>
                <ReadMoreBtn>
                  Read Full Story <i className="fas fa-arrow-right"></i>
                </ReadMoreBtn>
              </div>
            </FeaturedBody>
          </FeaturedCard>
        )}

        {/* Articles Grid */}
        <BlogGrid>
          {filteredArticles
            .filter(article => !(activeCategory === 'ALL' && article.isFeatured))
            .map(article => (
              <ArticleCard key={article.id} onClick={() => setSelectedArticle(article)}>
                <CardImageWrapper>
                  <FloatingTag>{article.category}</FloatingTag>
                  <img src={article.image} alt={article.title} />
                </CardImageWrapper>
                <CardBody>
                  <ArticleMeta>
                    <span><i className="far fa-calendar-alt"></i> {article.date}</span>
                    <span><i className="far fa-clock"></i> {article.readTime}</span>
                  </ArticleMeta>
                  <CardTitle>{article.title}</CardTitle>
                  <CardExcerpt>{article.excerpt}</CardExcerpt>
                  <CardFooter>
                    <AuthorInfo>
                      <img src={article.author.avatar} alt={article.author.name} />
                      <span>{article.author.name}</span>
                    </AuthorInfo>
                    <ReadMoreBtn>
                      Read <i className="fas fa-arrow-right"></i>
                    </ReadMoreBtn>
                  </CardFooter>
                </CardBody>
              </ArticleCard>
            ))}
        </BlogGrid>

        {/* Newsletter Subscription Box */}
        <NewsletterBox>
          <NewsletterText>
            <h3>Stay in the Driver's Seat</h3>
            <p>
              Subscribe to the DriveOnRyd Journal for exclusive travel itineraries, supercar drop notifications, and secret member discounts.
            </p>
          </NewsletterText>
          <div>
            <NewsletterForm onSubmit={handleSubscribe}>
              <NewsletterInput
                type="email"
                placeholder="Enter your email address..."
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                required
              />
              <NewsletterButton type="submit">
                Subscribe
              </NewsletterButton>
            </NewsletterForm>
            {isSubscribed && (
              <div style={{ color: '#00d4ff', fontSize: '0.88rem', marginTop: '10px', fontWeight: 600 }}>
                <i className="fas fa-check-circle"></i> Thanks for joining! Look out for our next edition in your inbox.
              </div>
            )}
          </div>
        </NewsletterBox>
      </Container>

      {/* Full Article Reader Modal */}
      <Modal
        isOpen={!!selectedArticle}
        onRequestClose={() => setSelectedArticle(null)}
        style={modalStyles}
        contentLabel="Article Reader"
        ariaHideApp={false}
      >
        {selectedArticle && (
          <div>
            <ModalHero>
              <ModalCloseBtn onClick={() => setSelectedArticle(null)} aria-label="Close article">
                <i className="fas fa-times"></i>
              </ModalCloseBtn>
              <img src={selectedArticle.image} alt={selectedArticle.title} />
            </ModalHero>
            <ModalContent>
              <ArticleMeta style={{ marginBottom: '16px' }}>
                <CategoryTag>{selectedArticle.category}</CategoryTag>
                <span><i className="far fa-calendar-alt"></i> {selectedArticle.date}</span>
                <span><i className="far fa-clock"></i> {selectedArticle.readTime}</span>
              </ArticleMeta>
              <ModalTitle>{selectedArticle.title}</ModalTitle>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '20px' }}>
                <img
                  src={selectedArticle.author.avatar}
                  alt={selectedArticle.author.name}
                  style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #00d4ff', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>{selectedArticle.author.name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>DriveOnRyd Editorial Team</div>
                </div>
              </div>

              <StoryText>
                {selectedArticle.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </StoryText>

              {selectedArticle.proTip && (
                <ProTipBox>
                  <h5><i className="fas fa-lightbulb"></i> Driver Pro Tip</h5>
                  <p>{selectedArticle.proTip}</p>
                </ProTipBox>
              )}
            </ModalContent>
          </div>
        )}
      </Modal>
    </SectionWrapper>
  );
};

export default Blog;
