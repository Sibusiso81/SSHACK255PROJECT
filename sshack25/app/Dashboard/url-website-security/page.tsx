"use client";
import React, { useEffect, useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Globe,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type LLMAnalysis = {
  url: string;
  riskLevel: string;
  overallStatus: string;
  issues: string[];
  summary: string;
  recommendations: string[];
};

const Page = () => {
  const [showReport, setShowReport] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [llmAnalyses, setLlmAnalyses] = useState<LLMAnalysis[]>([]);

  useEffect(() => {
    async function fetchLLMAnalyses() {
      // Replace this with your actual LLM fetch logic
      // Example dummy data:
      const response: LLMAnalysis[] = [
        {
          url: "https://example.com",
          riskLevel: "High",
          overallStatus: "Threat",
          issues: ["Outdated SSL certificate", "No CSP header"],
          summary: "This website has several security issues.",
          recommendations: ["Update SSL certificate", "Add CSP header"],
        },
        // ...more analyses
      ];
      setLlmAnalyses(response);
    }
    if (permissionGranted) {
      fetchLLMAnalyses();
    }
  }, [permissionGranted]);

  if (!permissionGranted && !permissionDenied) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <Shield className="h-10 w-10 mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold mb-2">Permission Required</h2>
          <p className="mb-6 text-muted-foreground">
            To generate a detailed website security report, we need your
            permission to use information collected by the browser extension.
          </p>
          <div className="flex gap-4">
            <Button className="w-1/2" onClick={() => setPermissionGranted(true)}>
              Allow and Continue
            </Button>
            <Button
              className="w-1/2"
              variant="outline"
              onClick={() => setPermissionDenied(true)}
            >
              Decline
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-8 w-8" />
              <h1 className="text-4xl font-bold">Website Security Center</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Analyze website security and risk exposure
            </p>
          </div>

          {/* Website Security Table */}
          <Card>
            <CardHeader>
              <CardTitle>Website Security Analysis</CardTitle>
              <CardDescription>
                Review your website security assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Recent website security analyses</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {llmAnalyses.map((analysis, idx) => (
                    <TableRow key={analysis.url}>
                      <TableCell className="font-mono text-sm">
                        {analysis.url}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            analysis.riskLevel === "High"
                              ? "destructive"
                              : analysis.riskLevel === "Medium"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {analysis.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            analysis.overallStatus === "Threat"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {analysis.overallStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog open={showReport === idx} onOpenChange={open => setShowReport(open ? idx : null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={permissionDenied}
                              title={
                                permissionDenied
                                  ? "Permission denied. Enable permission to view the report."
                                  : ""
                              }
                            >
                              View Report
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Website Security Report
                              </DialogTitle>
                              <DialogDescription>
                                Detailed security assessment for{" "}
                                <span className="font-semibold">{analysis.url}</span>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                              <div>
                                <span className="font-semibold">Risk Level:</span>{" "}
                                <Badge
                                  variant={
                                    analysis.riskLevel === "High"
                                      ? "destructive"
                                      : analysis.riskLevel === "Medium"
                                      ? "secondary"
                                      : "default"
                                  }
                                >
                                  {analysis.riskLevel}
                                </Badge>
                              </div>
                              <div>
                                <span className="font-semibold">Status:</span>{" "}
                                <Badge
                                  variant={
                                    analysis.overallStatus === "Threat"
                                      ? "destructive"
                                      : "default"
                                  }
                                >
                                  {analysis.overallStatus}
                                </Badge>
                              </div>
                              <div>
                                <span className="font-semibold">Issues:</span>
                                <ul className="list-disc ml-6">
                                  {analysis.issues.length > 0 ? (
                                    analysis.issues.map((issue, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-center gap-2 text-sm"
                                      >
                                        <AlertTriangle className="h-4 w-4 flex-shrink-0 text-yellow-600" />
                                        <span>{issue}</span>
                                      </li>
                                    ))
                                  ) : (
                                    <li className="flex items-center gap-2 text-sm">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span>No issues detected</span>
                                    </li>
                                  )}
                                </ul>
                              </div>
                              <div>
                                <span className="font-semibold">Summary:</span>
                                <p className="text-muted-foreground">
                                  {analysis.summary}
                                </p>
                              </div>
                              <div>
                                <span className="font-semibold">
                                  Recommendations:
                                </span>
                                <ul className="list-disc ml-6">
                                  {analysis.recommendations.length > 0 ? (
                                    analysis.recommendations.map((rec, idx) => (
                                      <li key={idx}>{rec}</li>
                                    ))
                                  ) : (
                                    <li>None</li>
                                  )}
                                </ul>
                              </div>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );



}

export default Page
