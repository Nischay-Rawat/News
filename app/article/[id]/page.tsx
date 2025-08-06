import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronLeft, Clock, MapPin, Share2 } from "lucide-react"
import NewsletterSignup from "@/components/newsletter-signup"

export default function ArticlePage({ params }: { params: { id: string } }) {
  // This would normally come from an API or database based on the ID
  const article = {
    id: params.id,
    title: "उत्तराखंड के पहाड़ों में नया पर्यटन केंद्र, पर्यटकों की संख्या बढ़ने की उम्मीद",
    excerpt:
      "राज्य सरकार ने उत्तराखंड के पहाड़ी क्षेत्रों में नए पर्यटन केंद्र विकसित करने की योजना की घोषणा की है, जिससे स्थानीय अर्थव्यवस्था को बढ़ावा मिलने की उम्मीद है।",
    image: "/placeholder.svg?height=600&width=1200&query=uttarakhand mountains landscape news",
    date: "24 मई, 2025",
    time: "10 मिनट पहले",
    location: "देहरादून",
    author: "राजेश शर्मा",
    content: `
      <p>देहरादून, 24 मई 2025: उत्तराखंड सरकार ने राज्य के पहाड़ी क्षेत्रों में नए पर्यटन केंद्र विकसित करने की महत्वाकांक्षी योजना की घोषणा की है। इस योजना के तहत, राज्य के कम विकसित पहाड़ी क्षेत्रों में पर्यटन सुविधाओं का विकास किया जाएगा, जिससे पर्यटकों की संख्या बढ़ने और स्थानीय अर्थव्यवस्था को बढ़ावा मिलने की उम्मीद है।</p>
      
      <p>मुख्यमंत्री ने कहा, "हमारा उद्देश्य उत्तराखंड के हर कोने को पर्यटन के नक्शे पर लाना है। इससे न केवल पर्यटकों को नए स्थान देखने का मौका मिलेगा, बल्कि स्थानीय लोगों को रोजगार के अवसर भी मिलेंगे।"</p>
      
      <p>इस योजना के पहले चरण में, पांच नए पर्यटन केंद्रों का विकास किया जाएगा, जिनमें चमोली, पिथौरागढ़, उत्तरकाशी, रुद्रप्रयाग और बागेश्वर जिले शामिल हैं। इन केंद्रों में आधुनिक सुविधाओं के साथ-साथ स्थानीय संस्कृति और परंपराओं को भी बढ़ावा दिया जाएगा।</p>
      
      <p>पर्यटन विभाग के एक अधिकारी ने बताया, "हम इन केंद्रों में इको-टूरिज्म, एडवेंचर टूरिज्म और कल्चरल टूरिज्म पर विशेष जोर देंगे। साथ ही, स्थानीय लोगों को होम स्टे और अन्य पर्यटन गतिविधियों से जोड़ा जाएगा, ताकि उन्हें आर्थिक लाभ मिल सके।"</p>
      
      <p>इस योजना के लिए सरकार ने 500 करोड़ रुपये का बजट आवंटित किया है, और इसे अगले दो वर्षों में पूरा करने का लक्ष्य रखा गया है। पर्यटन विशेषज्ञों का मानना है कि इस योजना से उत्तराखंड के पर्यटन क्षेत्र में नई जान आएगी और राज्य की अर्थव्यवस्था को मजबूती मिलेगी।</p>
      
      <p>होटल एसोसिएशन के अध्यक्ष ने इस योजना का स्वागत करते हुए कहा, "यह एक सराहनीय कदम है। इससे न केवल पर्यटन क्षेत्र को बढ़ावा मिलेगा, बल्कि स्थानीय लोगों को भी रोजगार के नए अवसर मिलेंगे।"</p>
      
      <p>पर्यावरणविदों ने भी इस योजना का समर्थन किया है, लेकिन साथ ही चेतावनी दी है कि विकास के साथ-साथ पर्यावरण संरक्षण पर भी ध्यान देना जरूरी है। उन्होंने कहा, "हमें यह सुनिश्चित करना होगा कि पर्यटन विकास के नाम पर पर्यावरण को नुकसान न पहुंचे।"</p>
      
      <p>सरकार ने आश्वासन दिया है कि इस योजना में पर्यावरण संरक्षण को प्राथमिकता दी जाएगी और सभी विकास कार्य पर्यावरण के अनुकूल होंगे।</p>
    `,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">उत्तराखंड न्यूज़</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="/" className="font-medium transition-colors hover:text-primary">
              होम
            </Link>
            <Link href="#" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              देहरादून
            </Link>
            <Link href="#" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              नैनीताल
            </Link>
            <Link href="#" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              हरिद्वार
            </Link>
            <Link href="#" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              मसूरी
            </Link>
            <Link href="#" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              ऋषिकेश
            </Link>
          </nav>
          <Button variant="outline" size="sm" className="hidden md:flex">
            हिंदी
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <article className="container py-6 md:py-10">
          <div className="mx-auto max-w-3xl">
            <Button variant="ghost" size="sm" className="mb-6" asChild>
              <Link href="/">
                <ChevronLeft className="mr-2 h-4 w-4" />
                वापस जाएं
              </Link>
            </Button>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{article.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{article.location}</span>
              </div>
              <div>
                <span>लेखक: {article.author}</span>
              </div>
            </div>

            <div className="relative aspect-[16/9] w-full mb-6">
              <Image
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>

            <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: article.content }} />

            <div className="flex justify-between items-center border-t border-b py-4 my-8">
              <div className="text-sm">
                <span className="font-medium">श्रेणी:</span> पर्यटन
              </div>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                शेयर करें
              </Button>
            </div>

            <div className="space-y-8">
              <h2 className="text-xl font-bold">संबंधित खबरें</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group">
                  <Link href="#">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg mb-3">
                      <Image
                        src="/placeholder.svg?height=300&width=400&query=uttarakhand tourism"
                        alt="मसूरी में पर्यटकों की भीड़"
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                      मसूरी में पर्यटकों की भीड़, होटल व्यवसायियों ने की रिकॉर्ड कमाई
                    </h3>
                  </Link>
                </div>
                <div className="group">
                  <Link href="#">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg mb-3">
                      <Image
                        src="/placeholder.svg?height=300&width=400&query=uttarakhand tourism policy"
                        alt="उत्तराखंड में नई पर्यटन नीति"
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                      उत्तराखंड में नई पर्यटन नीति की घोषणा, स्थानीय व्यवसायों को मिलेगा बढ़ावा
                    </h3>
                  </Link>
                </div>
                <div className="group">
                  <Link href="#">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg mb-3">
                      <Image
                        src="/placeholder.svg?height=300&width=400&query=nainital lake tourism"
                        alt="नैनीताल में नए पर्यटन स्थल"
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                      नैनीताल में नए पर्यटन स्थलों का विकास, पर्यटकों को मिलेंगे नए विकल्प
                    </h3>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>

        <section className="bg-muted py-12">
          <div className="container">
            <NewsletterSignup />
          </div>
        </section>
      </main>
      <footer className="border-t bg-background">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link href="/" className="inline-block mb-4 md:mb-0">
              <span className="text-xl font-bold text-primary">उत्तराखंड न्यूज़</span>
            </Link>
            <div className="flex space-x-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                हमारे बारे में
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                संपर्क करें
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                नियम और शर्तें
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                गोपनीयता नीति
              </Link>
            </div>
          </div>
          <div className="border-t mt-4 pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} उत्तराखंड न्यूज़. सर्वाधिकार सुरक्षित.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
