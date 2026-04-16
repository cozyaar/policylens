# PolicyLens 🔍

PolicyLens makes finding the right health insurance policy less of a headache. I built this to cut through the marketing fluff and give you straight, data-backed answers. It scores policies, highlights the hidden loopholes, and uses AI to chat with you to recommend the best match based on your specific needs.

## Why I Built This
Finding a good health insurance policy usually means sifting through 100-page policy wordings, missing the fine print, and eventually just trusting an agent who is probably making a commission. PolicyLens is heavily designed to automate the heavy lifting:
- **Radar Charts for Visual Scoring**: Instantly see if a policy favors coverage, cost, or claim settlement ratios.
- **Loophole Detection**: Exposes hidden clauses like room rent capping or mandatory copayments that insurers try to bury.
- **AI Chatbot**: You can chat directly with the built-in Gemini AI to figure out which policy fits your personal situation (e.g., "I'm 30, smoke occasionally, and have aging parents—what's best?").

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Database**: Supabase (PostgreSQL) + Drizzle ORM
- **Styling**: TailwindCSS & Framer Motion for the silky smooth UI
- **AI Integration**: Google Gemini API

## Running it Locally

If you want to clone this and run it yourself, you absolutely can. Just follow these steps:

1. **Clone the repo**
   ```bash
   git clone https://github.com/cozyaar/policylens.git
   cd policylens
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your environment variables**
   Create a `.env.local` file in the root. You'll need a Supabase Database URL and a Gemini API key:
   ```env
   DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
   GEMINI_API_KEY="your_google_gemini_api_key_here"
   ```
   *(Don't stress, the `.gitignore` is already set up to ignore `.env.local` so you won't accidentally push your secrets to GitHub.)*

4. **Spin it up**
   ```bash
   npm run dev
   ```
   Hit up `http://localhost:3000` to see it live.

## Database & Security
We use Drizzle to interact with the Supabase Postgres database. Also, the app uses Row Level Security (RLS) on the tables. This means the client app only has public read access, preventing anyone from modifying or deleting your data dynamically from the browser. 

## Contributing
If you've got ideas on how to make the scoring algorithm better, or want to add support for more insurers, feel free to open a pull request! Just keep the code relatively clean.

## License
MIT. Do whatever you want with it, just please don't hold me liable if you buy the wrong policy!
