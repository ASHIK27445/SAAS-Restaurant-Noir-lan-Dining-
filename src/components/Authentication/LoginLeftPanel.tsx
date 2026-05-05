export default function LoginLeftPanel(){
    return(
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-primary relative items-center justify-center p-8 lg:p-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMUo5zxTh4U6WTf-5zozP9Y49RkTo9TbHqOtxFhFmr5LTo8zRYDC5psyup8yU8OsrKH61QYgWTeY7t4zrsrmm9JLLbAqsGAVwxz74ODXIEjSKWzsUkhnm2Co0Xuyy_o-wVOJacl7l2UkGHMoV69pOxJ34ROsnCxx-b0JyXrCjqq45CXCL4BKgLKQHLHgl9xNxkyqnA_z1QQiEaB838-uycDvYc8YPUCjJZMYhVyIMWwcRd5H7eJ7KfxtjjzXPyzf-eQpVCxVuj7Gk"
            alt="Moody dining table"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg text-center lg:text-left">
          <div className="mb-6 lg:mb-8">
            <span className="text-white/60 font-['Inter',sans-serif] uppercase tracking-widest text-xs mb-3 lg:mb-4 block">
              Est. 2024
            </span>
            <h1 className="font-['Noto_Serif',serif] italic text-4xl lg:text-6xl xl:text-7xl text-white leading-tight tracking-tight">
              The Culinary Editorial
            </h1>
          </div>

          <p className="font-['Noto_Serif',serif] text-lg lg:text-xl xl:text-2xl text-white/80 leading-relaxed mb-8 lg:mb-12">
            Where intentional dining meets digital hospitality. Your seat at the table is waiting.
          </p>

          <div className="flex items-center gap-4 border-t border-white/10 pt-6 lg:pt-8">
            <div className="flex -space-x-3">
              {[
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBpC50W9o0jxWUjdJT0SaPGl_c60CMTPD5gl6HNJ604UXBgerJypIpg7m9dprL-ErjzfpHcBldt81scdP7xXktLdHar72X9JW1TUEDE3AC2Ot3ZpYOTbmRg7UIk3Hx1Ciot-dRMmE6EbSmVWRc4jIeFaUi-q5cutMj737rJiRlr63aoFjR1AvIsZwDGGJm-D__JgnrdZDz5KLGHxNJXqfa2k2MC7_vX9abagug-8VJlZhQP320XtBjfKuepS_an49LJYLrukbp41UM",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA0Jh0y_Bx2k-YKYznZgnrKpW42CpMCwinUKsAtn4KHCXkJJqj0aqK3clNncgffu0GsXwiIkgSjJwLVozxACQysy_8ni-RfaJ5Uth3QPhUxQR5jAr4PPzLuSLYAW4GJrovce_w8d1EDIC265FgrgnskQVzRUkRcRG4BoifCji42j0kFQq2lTkdCKhBMxNFFg17M-dLSJo85IHaVHJkQPmavT3gMQXfE04DIAYdxp4WS1SX3Yz5TL_ZhQrTcDLMkAoWyWta_lLzU2L8",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDbJfhLeXOTGsXi_sW4lAbgQZNHfNzl_sllsdgbn7b4PLAEgPu7xNcOWr4mTXFFr64n4slGlEzAf6XymG_651_YX4Fzi6wLuXQHbXqYir9Txno8VGg6R6z1HtZmQSDzV5QdRhkZv1NLr3u6EUUNZoBZaphJOyIpVIEPS9UpzDehRzKkZ4a77CLwnlR8l5jKeBk-W0SLVX1LrZqE2iLwAkDEcnSB5CmQEZBcyfGTDJLQFVY-YzqsSqFUihVMnJiXg4InXqR957jz6hM",
              ].map((src, i) => (
                <img
                  key={i}
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-primary object-cover"
                  src={src}
                  alt="Patron portrait"
                />
              ))}
            </div>
            <p className="text-white/70 text-xs lg:text-sm font-['Inter',sans-serif] tracking-wide">
              Join 2,000+ patrons in our curated community.
            </p>
          </div>
        </div>
      </div>
    )
}