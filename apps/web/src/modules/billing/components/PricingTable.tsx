"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "1 project",
      "10 drafts/month",
      "Draft only publishing",
      "Basic SEO tools",
    ],
  },
  {
    name: "Starter",
    price: "$29",
    period: "per month",
    description: "For growing blogs",
    features: [
      "3 projects",
      "30 publishes/month",
      "Auto-publish enabled",
      "BYOK support",
      "Advanced SEO tools",
    ],
    popular: true,
  },
  {
    name: "Pro",
    price: "$99",
    period: "per month",
    description: "For professional teams",
    features: [
      "10 projects",
      "120 publishes/month",
      "Everything in Starter",
      "Content templates",
      "Priority support",
    ],
  },
]

export function PricingTable() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {plan.name}
              {plan.popular && <Badge>Popular</Badge>}
            </CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline">
              <span className="text-4xl font-bold">{plan.price}</span>
              {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
              {plan.name === "Free" ? "Get Started" : "Upgrade"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
