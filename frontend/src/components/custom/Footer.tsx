import { productLinks, companyLinks, legalLinks } from "@/constants/contant"
import { Search, Link } from "lucide-react"

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">
          <div className="space-y-4 md:col-span-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">NoteFlow</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Designed for the thinkers who thrive in the quiet hours. The
              nocturnal architect's workspace for complex ideas.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <Link className="cursor-pointer text-muted-foreground hover:text-primary hover:transition-all hover:duration-300" />
              <Search className="cursor-pointer text-muted-foreground hover:text-primary hover:transition-all hover:duration-300" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8">
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-muted-foreground">
                Product
              </h3>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                      onClick={(e) => e.preventDefault()}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-muted-foreground">
                Company
              </h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                      onClick={(e) => e.preventDefault()}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden sm:block"></div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {year} NoteFlow Inc. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {legalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                  onClick={(e) => e.preventDefault()}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer