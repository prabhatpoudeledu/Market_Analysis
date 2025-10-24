import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using StockToons, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Use of Service</h2>
              <p className="text-muted-foreground">
                StockToons provides financial market data and analytics for informational purposes only. The service is
                not intended to provide investment advice. You are solely responsible for your investment decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground">
                The service is provided "as is" without warranties of any kind, either express or implied. We do not
                warrant that the service will be uninterrupted, timely, secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Investment Risk Disclosure</h2>
              <p className="text-muted-foreground">
                All investments involve risk, including the loss of principal. Past performance does not guarantee
                future results. The information provided on StockToons should not be considered as financial advice.
                Always consult with a qualified financial advisor before making investment decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                StockToons shall not be liable for any indirect, incidental, special, consequential, or punitive damages
                resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. User Conduct</h2>
              <p className="text-muted-foreground">
                You agree not to use the service for any unlawful purpose or in any way that could damage, disable,
                overburden, or impair the service. You may not attempt to gain unauthorized access to any portion of the
                service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content, features, and functionality of StockToons are owned by us and are protected by
                international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Modifications to Service</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify or discontinue the service at any time without notice. We shall not be
                liable to you or any third party for any modification, suspension, or discontinuance of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Governing Law</h2>
              <p className="text-muted-foreground">
                These terms shall be governed by and construed in accordance with applicable laws, without regard to its
                conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at legal@stocktoons.com
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
