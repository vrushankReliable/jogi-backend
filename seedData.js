require('dotenv').config();
const mongoose = require('mongoose');
const Banner = require('./src/modules/banners/bannerModel');
const Disease = require('./src/modules/diseases/diseaseModel');
const Faq = require('./src/modules/faqs/faqModel');
const User = require('./src/models/User');
const Blog = require('./src/modules/blogs/blogModel');
const Book = require('./src/modules/books/bookModel');
const ApiKey = require('./src/models/ApiKey');
const bcrypt = require('bcryptjs');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/jogi-ayurved';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected.');

    // Helper for syncing
    const sync = async (Model, query, data) => {
        let doc = await Model.findOne(query);
        if (doc) {
            Object.assign(doc, data);
            await doc.save();
        } else {
            await Model.create(data);
        }
    };

    // 1. Seed Admin User
    console.log('Syncing Admin User...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
        admin = await User.create({
            email: adminEmail,
            password: process.env.ADMIN_PASSWORD || '123456',
            role: 'super_admin'
        });
        console.log('Admin User created.');
    } else {
        console.log('Admin User exists.');
    }

    // 1.5 Sync Master API Key
    console.log('Syncing Master API Key...');
    const masterKeyId = 'JOGI_FRONTEND_KEY';
    const masterSecret = '1234567890'; // In prod, use env
    const keyHash = await bcrypt.hash(masterSecret, 10);
    
    await sync(ApiKey, { keyId: masterKeyId }, {
        keyId: masterKeyId,
        keyHash: keyHash,
        name: 'Master Frontend Key',
        scopes: ['blogs_read', 'diseases_read', 'faqs_read', 'banners_read'],
        createdBy: admin._id
    });
    console.log(`Master API Key synced: ${masterKeyId}.${masterSecret}`);

    // 2. Sync Banners
    console.log('Syncing Banners...');
    const banners = [
      { type: 'main', image: 'uploads/hero-banner-main1.png', alt: 'JOGI Ayurved Main Banner 1', order: 1 },
      { type: 'main', image: 'uploads/hero-banner-main1.png', alt: 'JOGI Ayurved Main Banner 2', order: 2 },
      { type: 'main', image: 'uploads/hero-banner-main1.png', alt: 'JOGI Ayurved Main Banner 3', order: 3 },
      { type: 'main', image: 'uploads/hero-banner-main1.png', alt: 'JOGI Ayurved Main Banner 4', order: 4 },
      { type: 'mini', image: 'uploads/hero-banner-mini1.png', title: 'In-Person Consultation', link: '/consultation', order: 1 },
      { type: 'mini', image: 'uploads/hero-banner-mini2.png', title: 'Online Consultation', link: '/online-consultation', order: 2 },
      { type: 'mini', image: 'uploads/hero-banner-mini3.png', title: 'Panchakarma Treatment', link: '/panchakarma', order: 3 },
      { type: 'mini', image: 'uploads/hero-banner-mini4.png', title: 'Garbh Sanskar', link: '/garbh-sanskar', order: 4 },
      { 
        type: 'why_jogi', 
        image: 'uploads/why-jogi/slide1.png', 
        label: 'Personalised Root-Cause', 
        title: 'Why JOGI Ayurved?', 
        description: 'JOGI Ayurved focuses on treating the root cause of illness through authentic Ayurvedic principles and personalized care.',
        order: 1
      },
      { 
        type: 'why_jogi', 
        image: 'uploads/why-jogi/slide2.png', 
        label: 'Natural Healing', 
        title: 'Why JOGI Ayurved?', 
        description: 'Guided lifestyle recommendations.',
        order: 2
      },
      { type: 'why_jogi', image: 'uploads/why-jogi/slide3.png', label: 'Traditional Therapies', title: 'Why JOGI Ayurved?', description: 'Authentic Ayurvedic principles.', order: 3 },
      { type: 'why_jogi', image: 'uploads/why-jogi/slide4.png', label: 'Holistic Wellness', title: 'Why JOGI Ayurved?', description: 'Restoring balance naturally.', order: 4 }
    ];

    for (const b of banners) {
        await sync(Banner, { type: b.type, order: b.order }, b);
    }

    // 3. Sync Diseases
    console.log('Syncing Diseases...');
    const diseases = [
      { name: "Hair Problems", image: "uploads/diseases/hair-problems.png", conditions: ["Hair Loss", "Dandruff", "Scalp Psoriasis", "Alopecia"], summary: "Ayurveda is an ancient healing system that restores balance in the body's energies." },
      { name: "Digestive Disorders", image: "uploads/diseases/digestive-disorders.png", conditions: ["Constipation", "GERD", "IBS", "Acidity"], summary: "Restore your digestive health." },
      { name: "Joints & Muscle Pain", image: "uploads/diseases/joint-and-muscle-pain.jpg", conditions: ["Spondylitis", "Arthritis", "Sciatica", "AVN"], summary: "Relieve pain and improve mobility." },
      { name: "Neurological Disorders", image: "uploads/diseases/neurological-disorder.png", conditions: ["Migraine", "Epilepsy", "Parkinson’s", "Sciatica"], summary: "Comprehensive care." },
      { name: "Skin Disease", image: "uploads/diseases/skin-diseases.png", conditions: ["Psoriasis", "Urticaria", "Vitiligo", "Eczema"], summary: "Natural treatment." },
      { name: "Gynecological Disease", image: "uploads/diseases/gynecological-diseases.jpg", conditions: ["PCOD/PCOS", "Infertility", "Leucorrhoea", "Menopause Problems"], summary: "Empowering women's health." },
      { name: "Endocrine Diseases", image: "uploads/diseases/endocrine-diseases.png", conditions: ["Diabetes", "Obesity", "Thyroid", "PCOS"], summary: "Manage hormonal imbalances." },
      { name: "Sexual Problems", image: "uploads/diseases/sexual-problems.png", conditions: ["Erectile Dysfunction", "Oligospermia", "Varicocele", "Premature Ejaculation"], summary: "Holistic approach." },
      { name: "Respiratory Disorders", image: "uploads/diseases/respiratory-diseases.png", conditions: ["Asthma", "Bronchitis", "Allergic Rhinitis", "Sinusitis"], summary: "Breathe free." },
      { name: "Life Style Disease", image: "uploads/diseases/life-style-diseases.png", conditions: ["Obesity", "Diabetes", "Hypertension", "PCOD"], summary: "Prevent and manage lifestyle ailments." },
      { name: "Anorectal Disease", image: "uploads/diseases/anorectal-diseases.jpg", conditions: ["Piles", "Fissure", "Fistula", "Pilonidal sinus"], summary: "Painless and effective care." },
      { name: "Mental Health", image: "uploads/diseases/mental-health.jpg", conditions: ["Anxiety", "Depression", "Sleep Apnea", "Insomnia"], summary: "Calm your mind." }
    ];

    for (const d of diseases) {
        await sync(Disease, { name: d.name }, d);
    }

    // 4. Sync FAQs
    console.log('Syncing FAQs...');
    const faqs = [
      { category: 'ALL', question: 'What is Ayurveda?', answer: 'Ayurveda is an ancient Indian system of medicine that focuses on achieving optimal health through a balance of mind, body, and spirit. It uses natural remedies, dietary guidelines, and lifestyle practices to prevent and treat illness.' },
      { category: 'ALL', question: 'Is Ayurvedic treatment safe?', answer: 'Yes, Ayurvedic treatments are generally safe when administered by qualified practitioners. All treatments use natural herbs and therapies that have been used for thousands of years with proven efficacy.' },
      { category: 'ALL', question: 'How does Ayurveda treat diseases?', answer: 'Ayurveda treats diseases by identifying the root cause and restoring balance to the body\'s doshas (Vata, Pitta, Kapha). Treatment includes herbal medicines, Panchakarma therapies, dietary changes, and lifestyle modifications.' },
      { category: 'ALL', question: 'What are the three doshas in Ayurveda?', answer: 'The three doshas are Vata (air and space), Pitta (fire and water), and Kapha (water and earth). Each person has a unique combination of these doshas that determines their physical and mental characteristics.' },
      { category: 'ALL', question: 'Can Ayurveda cure chronic diseases?', answer: 'Ayurveda can help manage and often significantly improve chronic conditions by addressing the root cause rather than just symptoms. Many patients experience substantial relief from conditions like arthritis, diabetes, and digestive disorders.' },
      { category: 'ONLINE CONSULTATION', question: 'Do Ayurvedic medicines have side effects?', answer: 'When taken under proper guidance, Ayurvedic medicines have minimal to no side effects. They are made from natural ingredients and are designed to work in harmony with your body.' },
      { category: 'ONLINE CONSULTATION', question: 'How long does Ayurvedic treatment take to show results?', answer: 'The time for results varies depending on the condition and individual constitution. Some patients experience improvement within weeks, while chronic conditions may require several months of consistent treatment.' },
      { category: 'ONLINE CONSULTATION', question: 'How can I book an online consultation?', answer: 'You can book an online consultation through our website by selecting the \'Online Consultation\' option, choosing your preferred doctor and time slot. Video consultations are available via Zoom or Google Meet.' },
      { category: 'ONLINE CONSULTATION', question: 'What documents should I prepare for online consultation?', answer: 'Please have your previous medical reports, current medication list, and any relevant test results ready. Also prepare a list of your symptoms and health concerns to discuss with the doctor.' },
      { category: 'ONLINE CONSULTATION', question: 'Can I get medicines delivered after online consultation?', answer: 'Yes, we offer doorstep delivery of Ayurvedic medicines across India after your online consultation. Medicines are typically delivered within 3-5 business days.' },
      { category: 'PANCHAKARMA', question: 'What is Panchakarma therapy?', answer: 'Panchakarma is a comprehensive Ayurvedic detoxification and rejuvenation program consisting of five therapeutic treatments. It helps remove toxins from the body and restore balance to the doshas.' },
      { category: 'PANCHAKARMA', question: 'How long does a Panchakarma treatment take?', answer: 'A complete Panchakarma program typically takes 7 to 21 days depending on the individual\'s health condition and treatment goals. Some specialized programs may extend up to 28 days.' },
      { category: 'PANCHAKARMA', question: 'Is Panchakarma suitable for everyone?', answer: 'While Panchakarma benefits most people, it\'s not recommended during pregnancy, for very young children, or for people with certain acute conditions. A consultation with our doctors will determine if it\'s right for you.' },
      { category: 'PANCHAKARMA', question: 'What should I expect during Panchakarma treatment?', answer: 'During Panchakarma, you\'ll receive daily therapies including oil massages, steam treatments, and specialized procedures. You\'ll follow a specific diet and lifestyle routine to maximize the benefits.' },
      { category: 'PANCHAKARMA', question: 'How can I book an appointment?', answer: 'You can book a Panchakarma appointment by calling our clinic directly, using the online booking form on our website, or visiting our hospital. We recommend booking at least 2 weeks in advance.' }
    ];
    for (const f of faqs) {
        await sync(Faq, { question: f.question }, f);
    }

    // 5. Sync Blogs
    console.log('Syncing Blogs...');
    const blogs = [
        { title: "Healthy Dincharya", summary: "Ideal daily routine.", content: "Full content...", image: "uploads/spreading-ayurveda/spreading-ayurveda1.png", author: admin._id, isPublished: true },
        { title: "Gharno Ved", summary: "Household wisdom.", content: "Full content...", image: "uploads/spreading-ayurveda/spreading-ayurveda2.png", author: admin._id, isPublished: true }
    ];
    for (const blog of blogs) {
        await sync(Blog, { title: blog.title }, blog);
    }

    // 6. Sync Books (Spreading Ayurveda)
    console.log('Syncing Books...');
    const books = [
        { title: "Healthy Dincharya", image: "uploads/spreading-ayurveda/spreading-ayurveda1.png", order: 1 },
        { title: "Gharno Ved", image: "uploads/spreading-ayurveda/spreading-ayurveda2.png", order: 2 },
        { title: "Bhojanpratha", image: "uploads/spreading-ayurveda/spreading-ayurveda3.png", order: 3 },
        { title: "Prakruti Olakho", image: "uploads/spreading-ayurveda/spreading-ayurveda4.png", order: 4 },
        { title: "Garbhsanskar", image: "uploads/spreading-ayurveda/spreading-ayurveda5.png", order: 5 }
    ];
    for (const book of books) {
        await sync(Book, { title: book.title }, book);
    }

    console.log('Sync completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('--- SEEDING ERROR ---');
    console.error(err);
    process.exit(1);
  }
};

seedData();
