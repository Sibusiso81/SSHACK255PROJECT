"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarRadiusAxis,
  Label as RechartsLabel,
} from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
 
  Lock,
  AlertCircle,
} from "lucide-react";

import { main } from "@/Gemini/llm";
import { passwordReport } from "@/Gemini/prompts";
import { jsonrepair } from "jsonrepair";
import { createClient } from "@/lib/supabase/client";


interface Password {
  id: number;
  passwordUrl: string;
  strength: "Weak" | "Medium" | "Strong";
  breaches: number;
  issues: string[];
  strengthScore: number;
  secureAlternative?: string;
  securityTip?: string;
}

const strengthChartConfig: ChartConfig = {
  strength: {
    label: "Strength",
    color: "hsl(var(--foreground))",
  },
};

const breachChartConfig: ChartConfig = {
  breaches: {
    label: "Breaches",
    color: "hsl(var(--foreground))",
  },
};

function getStrengthVariant(strength: string) {
  if (strength === "Strong") return "default";
  if (strength === "Medium") return "secondary";
  return "destructive";
}

function getBreachVariant(breaches: number) {
  return breaches === 0 ? "default" : "destructive";
}

function generateSecuritySummary(password: Password) {
  if (password.breaches > 0) {
    return `This password has appeared in ${password.breaches} data breach${
      password.breaches > 1 ? "es" : ""
    }. Consider changing it.`;
  }
  if (password.strength === "Strong") {
    return "This password is strong and has not appeared in any known breaches.";
  }
  return "This password has some weaknesses. Review the issues and consider using a stronger password.";
}

function PasswordDashboard() {
  const [passwords, setPasswords] = useState<Password[]>([]);
  

  useEffect(() => {
    async function fetchUser() {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        console.log("User fetched:", data.user);
      }
      if (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, []);
  // Example Info object for demonstration
  const Info = {
    userHash: "21BD1D6CBA6A45BCB799D5C3470F8C9B0E44C35D",
    passwordUrl: "netflix.com",
    apiResponse: `6CBA6A45BCB799D5C3470F8C9B0E44C35D:5
77BC9F7A17CC5899B3D38F9B4453C4A743:34
ACD1BCB34789F2B1D8C22CDEDF454A3422:1`,
  };

  // Handles password analysis submission

  useEffect(() => {
    const fetchData = async () => {
      const key = process.env.NEXT_PUBLIC_GEMINI_AI_API_KEY;
      if (!key) {
        console.error("API key is missing");
        return;
      }
      try {
        const response = await main({
          key: key,
          prompt: passwordReport.propmt,
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${Info.userHash} ${Info.passwordUrl} ${Info.apiResponse}`,
                },
              ],
            },
          ],
        });
        let cleaned = response.replace(/^[\s\S]*?({)/, "$1");
        cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");
        
        const repaired = jsonrepair(cleaned);
        
        const parsed = JSON.parse(repaired);
        // Add the new password analysis to the table
      
        setPasswords((prev) => [
          ...prev,
          {
            id: parsed.id,
            passwordUrl: parsed.passwordUrl,
            strength: parsed.strength,
            breaches: parsed.breaches,
            issues: parsed.issues || [],
            strengthScore: parsed.strengthScore,
            secureAlternative: parsed.secureAlternative,
            securityTip: parsed.securityTip,
          },
        ]);
      } catch (e) {
        console.error("Failed to parse response:", e);
      }
    };
    fetchData();
  }, [Info.apiResponse, Info.passwordUrl, Info.userHash]);

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Password Security Center</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Analyze password strength and breach exposure
          </p>
        </div>

        {/* Password Analysis Table */}
        <Card>
          <CardHeader>
            <CardTitle>Password Security Analysis</CardTitle>
            <CardDescription>
              Review your password security assessments ({passwords.length}{" "}
              total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {passwords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  No password analyses yet. Add a password above to get started.
                </p>
              </div>
            ) : (
              <Table>
                <TableCaption>Recent password security analyses</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Strength</TableHead>
                    <TableHead>Issues</TableHead>
                    <TableHead>Breaches</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passwords.map((password) => (
                    <TableRow key={password.id}>
                      <TableCell className="font-mono text-sm">
                        {password.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {password.passwordUrl}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStrengthVariant(password.strength)}
                          className="gap-1"
                        >
                          {password.strength === "Strong" && (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          {password.strength !== "Strong" && (
                            <AlertTriangle className="h-3 w-3" />
                          )}
                          {password.strength}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {password.issues.length > 0
                          ? password.issues[0]
                          : "None"}
                        {password.issues.length > 1 &&
                          ` +${password.issues.length - 1} more`}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBreachVariant(password.breaches)}>
                          {password.breaches === 0 ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {password.breaches}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Report
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Password Security Report - ID: {password.id}
                                <Badge
                                  variant={
                                    password.breaches > 0
                                      ? "destructive"
                                      : "default"
                                  }
                                >
                                  {password.breaches > 0 ? "BREACHED" : "SAFE"}
                                </Badge>
                              </DialogTitle>
                              <DialogDescription className="text-base">
                                {generateSecuritySummary(password)}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
                              {/* Strength Chart */}
                              <Card>
                                <CardHeader className="text-center">
                                  <CardTitle className="text-lg">
                                    Password Strength
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                  <ChartContainer
                                    config={strengthChartConfig}
                                    className="mx-auto aspect-square max-h-[200px]"
                                  >
                                    <RadialBarChart
                                      width={200}
                                      height={200}
                                      data={[
                                        {
                                          name: "strength",
                                          value: password.strengthScore,
                                          fill: "hsl(var(--foreground))",
                                        },
                                      ]}
                                      startAngle={90}
                                      endAngle={450}
                                      innerRadius={60}
                                      outerRadius={90}
                                    >
                                      <PolarGrid
                                        gridType="circle"
                                        radialLines={false}
                                        stroke="none"
                                        className="first:fill-muted last:fill-background"
                                        polarRadius={[66, 54]}
                                      />
                                      <RadialBar
                                        dataKey="value"
                                        background
                                        cornerRadius={10}
                                        fill="hsl(var(--foreground))"
                                      />
                                      <PolarRadiusAxis
                                        tick={false}
                                        tickLine={false}
                                        axisLine={false}
                                      >
                                        <RechartsLabel
                                          content={({ viewBox }) => {
                                            if (
                                              viewBox &&
                                              "cx" in viewBox &&
                                              "cy" in viewBox
                                            ) {
                                              return (
                                                <text
                                                  x={viewBox.cx}
                                                  y={viewBox.cy}
                                                  textAnchor="middle"
                                                  dominantBaseline="middle"
                                                >
                                                  <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-2xl font-bold"
                                                  >
                                                    {password.strengthScore}%
                                                  </tspan>
                                                  <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 20}
                                                    className="fill-muted-foreground text-sm"
                                                  >
                                                    {password.strength}
                                                  </tspan>
                                                </text>
                                              );
                                            }
                                          }}
                                        />
                                      </PolarRadiusAxis>
                                    </RadialBarChart>
                                  </ChartContainer>
                                </CardContent>
                              </Card>

                              {/* Breach Chart */}
                              <Card>
                                <CardHeader className="text-center">
                                  <CardTitle className="text-lg">
                                    Data Breaches
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                  <ChartContainer
                                    config={breachChartConfig}
                                    className="mx-auto aspect-square max-h-[200px]"
                                  >
                                    <RadialBarChart
                                      width={200}
                                      height={200}
                                      data={[
                                        {
                                          name: "breaches",
                                          value: Math.min(
                                            password.breaches * 10,
                                            100
                                          ),
                                          count: password.breaches,
                                        },
                                      ]}
                                      startAngle={90}
                                      endAngle={450}
                                      innerRadius={60}
                                      outerRadius={90}
                                    >
                                      <PolarGrid
                                        gridType="circle"
                                        radialLines={false}
                                        stroke="none"
                                        className="first:fill-muted last:fill-background"
                                        polarRadius={[66, 54]}
                                      />
                                      <RadialBar
                                        dataKey="value"
                                        background
                                        cornerRadius={10}
                                        fill="hsl(var(--foreground))"
                                      />
                                      <PolarRadiusAxis
                                        tick={false}
                                        tickLine={false}
                                        axisLine={false}
                                      >
                                        <RechartsLabel
                                          content={({ viewBox }) => {
                                            if (
                                              viewBox &&
                                              "cx" in viewBox &&
                                              "cy" in viewBox
                                            ) {
                                              return (
                                                <text
                                                  x={viewBox.cx}
                                                  y={viewBox.cy}
                                                  textAnchor="middle"
                                                  dominantBaseline="middle"
                                                >
                                                  <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                  >
                                                    {password.breaches}
                                                  </tspan>
                                                  <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 20}
                                                    className="fill-muted-foreground text-sm"
                                                  >
                                                    Breaches
                                                  </tspan>
                                                </text>
                                              );
                                            }
                                          }}
                                        />
                                      </PolarRadiusAxis>
                                    </RadialBarChart>
                                  </ChartContainer>
                                </CardContent>
                              </Card>

                              {/* Issues */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">
                                    Identified Issues
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  {password.issues.length > 0 ? (
                                    password.issues.map((issue, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2 text-sm"
                                      >
                                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                                        <span>{issue}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="flex items-center gap-2 text-sm">
                                      <CheckCircle className="h-4 w-4" />
                                      <span>No issues detected</span>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>

                            <Separator />

                            {/* AI Suggestions and Tips */}
                            <div className="space-y-4">
                              {password.secureAlternative && (
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-base">
                                      🤖 AI-Generated Alternative
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <code className="bg-muted px-2 py-1 rounded text-sm">
                                      {password.secureAlternative}
                                    </code>
                                  </CardContent>
                                </Card>
                              )}

                              {password.securityTip && (
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-base">
                                      💡 Security Tip
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                      {password.securityTip}
                                    </p>
                                  </CardContent>
                                </Card>
                              )}

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-base">
                                    ❓ Why This Matters
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-muted-foreground">
                                    If your password appears in a data breach,
                                    cybercriminals can use it to attempt
                                    unauthorized access to your other accounts.
                                    Using unique, strong passwords for each
                                    service significantly reduces your risk of
                                    account compromise.
                                  </p>
                                </CardContent>
                              </Card>
                            </div>

                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Close Report</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PasswordDashboard;
