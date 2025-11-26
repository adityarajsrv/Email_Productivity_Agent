# DraftPilot - AI Email Productivity Suite 📧✨

DraftPilot is an intelligent email management platform that leverages AI to streamline your email workflow. From drafting and rewriting to summarizing and auto-responding, DraftPilot enhances productivity through smart automation and AI-powered insights.

## 🌟 Key Features

### 🤖 AI-Powered Email Composition
- **Smart Drafting**: Context-aware email generation with professional tone optimization
- **Intelligent Rewriting**: Improve clarity, fix grammar, and adapt tone for different audiences
- **Template Management**: Customizable email templates for various scenarios

### 📊 Productivity Analytics
- **Real-time Dashboard**: Track email processing metrics and productivity gains
- **Category Insights**: Automatic email classification (Important, Newsletter, Spam, To-Do)
- **Time Savings**: Monitor efficiency improvements and time reclamation

### 🔧 Advanced Automation
- **Auto-Reply System**: Intelligent response generation for meeting requests and common queries
- **Email Summarization**: Extract key points and action items from long threads
- **Action Item Extraction**: Automatic task identification with deadlines

### 🧠 PromptBrain Technology
- **Custom AI Prompts**: Create and manage specialized prompt templates
- **A/B Testing**: Compare prompt performance and optimize results
- **Version Control**: Track prompt iterations and improvements

## 📁 Project Structure

```
DraftPilot/
├── 📁 frontend/                 # React Vite Application
│   ├── 📁 node_modules/         # Dependencies (auto-generated)
│   ├── 📁 public/               # Static assets
│   │   └── 📁 src/
│   │       └── 📁 assets/
│   │           └── 🖼️ react.svg
│   ├── 📁 src/                  # Source code
│   │   ├── 📁 components/       # React components
│   │   │   ├── 🤖 AutoReply.jsx     # Auto-reply generation interface
│   │   │   ├── 📊 Dashboard.jsx     # Analytics and metrics dashboard
│   │   │   ├── 📝 DraftEmail.jsx    # AI email drafting tool
│   │   │   ├── 📚 History.jsx       # Email processing history
│   │   │   ├── 🧠 PromptBrain.jsx   # AI prompt management system
│   │   │   ├── ✏️ Rewrite.jsx       # Email rewriting and improvement
│   │   │   ├── ⚙️ Settings.jsx      # Application configuration
│   │   │   ├── 🧭 Sidebar.jsx       # Navigation component
│   │   │   └── 📋 Summaries.jsx     # Email summarization interface
│   │   └── 📁 pages/            # Main application pages
│   │       ├── 🎨 App.css           # Application styles
│   │       ├── 🚀 App.jsx           # Main application component
│   │       ├── 🎯 index.css         # Global styles
│   │       └── ⚡ main.jsx          # Application entry point
│   ├── 🔐 .env                   # Environment variables
│   ├── 📛 .gitignore            # Git ignore rules
│   ├── 🔍 eslint.config.js      # ESLint configuration
│   ├── 📄 index.html            # HTML template
│   ├── 📦 package-lock.json     # Dependency lock file
│   ├── 📦 package.json          # Dependencies and scripts
│   └── ⚡ vite.config.js        # Vite build configuration
│
└── 📁 backend/                  # FastAPI Python Application
    ├── 📁 app/                  # Application core
    │   ├── 📁 models/           # Data models and schemas
    │   │   ├── 📁 __pycache__/      # Python cache
    │   │   ├── 📝 draft_models.py   # Email draft models
    │   │   ├── 📧 email_models.py   # Email data structures
    │   │   └── 🧠 prompt_models.py  # AI prompt templates
    │   └── 📁 routes/           # API route handlers
    │       ├── 📁 __pycache__/      # Python cache
    │       ├── 🤖 autoreply.py      # Auto-reply endpoints
    │       ├── 📊 dashboard.py      # Analytics endpoints
    │       ├── 📧 emails.py         # Email management endpoints
    │       ├── 🧠 prompts.py        # Prompt management endpoints
    │       ├── ✏️ rewrite.py        # Email rewriting endpoints
    │       └── 📋 summaries.py      # Summary generation endpoints
    ├── 📁 schemas/              # Data validation schemas
    │   ├── 📁 __pycache__/          # Python cache
    │   ├── 📊 dashboard_schemas.py  # Analytics data validation
    │   ├── 📧 email_schemas.py      # Email data validation
    │   └── 🧠 prompt_schemas.py     # Prompt data validation
    ├── 📁 services/             # Business logic layer
    │   ├── 📁 __pycache__/          # Python cache
    │   ├── 📧 email_service.py      # Email data operations
    │   ├── 🤖 llm_service.py        # AI model integration
    │   ├── ⚙️ processing_service.py # Core email processing
    │   └── 🧠 prompt_service.py     # Prompt management logic
    ├── 🔐 .env                   # Environment configuration
    ├── 📛 .gitignore            # Git ignore rules
    ├── ⚙️ config.py             # Application configuration
    ├── 🗄️ database.py           # Database connection setup
    ├── 🚀 main.py               # FastAPI application entry point
    ├── 📦 requirements.txt      # Python dependencies
    └── ▶️ run.py                # Application runner
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Python 3.8+
- MongoDB
- Google Gemini API Key

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/your-org/draftpilot.git
cd draftpilot
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Environment Configuration**
```bash
# Backend .env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=draftpilot
GOOGLE_API_KEY=your_gemini_api_key

# Frontend .env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

5. **Start Development Servers**
```bash
# Terminal 1 - Backend
cd backend
python run.py

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

## 📖 User Guide

### Getting Started
1. **Load Sample Data**: Use the mock data loader to see DraftPilot in action
2. **Process Emails**: Let AI categorize and analyze your email content
3. **Explore Features**: Try drafting, rewriting, and summarizing emails

### Core Workflows

#### 📝 Drafting Emails
- Select the draft composer from the sidebar
- Provide context and key points
- AI generates professional email drafts
- Customize tone and length as needed

#### ✏️ Rewriting Content
- Paste existing email content
- Choose improvement focus (clarity, professionalism, conciseness)
- Apply suggested enhancements
- Compare original vs improved versions

#### 📋 Email Summarization
- Input long email threads or complex messages
- Receive concise summaries with key points
- Identify action items and deadlines
- Save summaries for future reference

#### 🤖 Auto-Reply Management
- Configure response templates for common scenarios
- Set up meeting request handlers
- Customize tone and response style
- Review before sending automated replies

### Advanced Features

#### 🧠 PromptBrain
- Access the PromptBrain interface from settings
- Create custom AI prompts for specific use cases
- Test prompts with sample emails
- Track performance and optimize templates

#### 📈 Analytics Dashboard
- Monitor email processing metrics
- Track time savings and productivity gains
- View category distribution charts
- Analyze response quality and engagement

## 🔧 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Key Endpoints

#### Email Management
- `GET /emails` - Retrieve email list
- `POST /emails/process` - Process emails with AI
- `GET /emails/processed` - Get analyzed emails

#### AI Features
- `POST /draft` - Generate email drafts
- `POST /rewrite` - Improve email content  
- `POST /summaries/generate` - Create email summaries
- `POST /autoreply/generate` - Generate auto-replies

#### Analytics
- `GET /dashboard/metrics` - Productivity metrics
- `GET /dashboard/categories` - Email categorization stats
- `GET /dashboard/activity` - Recent activities

### Authentication
DraftPilot uses JWT tokens for secure API access. Include the token in requests:
```http
Authorization: Bearer <your_jwt_token>
```

## 🚀 Deployment

### Production Build

**Frontend**
```bash
cd frontend
npm run build
```

**Backend**
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Environment Variables

**Production Backend**
```env
MONGODB_URL=your_production_mongodb_url
DATABASE_NAME=draftpilot_prod
GOOGLE_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
CORS_ORIGINS=https://yourdomain.com
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Install dependencies and set up environment
4. Make your changes
5. Add tests and ensure they pass
6. Submit a pull request

## ⭐ Support the Project

If you find this project helpful or interesting, please consider giving it a star on GitHub! Your support helps me continue to improve and maintain the project.

---
