import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Scale,
  Lightbulb,
  Heart,
  Plus,
  Loader2,
  Edit3,
  AlertTriangle,
  Trash2,
  RotateCcw,
} from "lucide-react";

interface LocalOption {
  id: number;
  text: string;
  pros: string[];
  cons: string[];
  valuesAlignment: number;
}

interface ReviewSectionProps {
  // Data
  decisionTitle: string;
  timeframe: string;
  importance: string;
  options: LocalOption[];
  personalValues: string[];
  emotionalContext: string;

  // Setters
  setDecisionTitle: (value: string) => void;
  setTimeframe: (value: string) => void;
  setImportance: (value: string) => void;
  setEmotionalContext: (value: string) => void;

  // Option handlers
  onOptionTextChange: (id: number, value: string) => void;
  onProChange: (optionId: number, index: number, value: string) => void;
  onConChange: (optionId: number, index: number, value: string) => void;
  onAddPro: (optionId: number) => void;
  onAddCon: (optionId: number) => void;
  onRemovePro: (optionId: number, index: number) => void;
  onRemoveCon: (optionId: number, index: number) => void;
  onAlignmentChange: (optionId: number, value: number[]) => void;
  onAddOption: () => void;
  onRemoveOption: (id: number) => void;

  // Value handlers
  onValueChange: (index: number, value: string) => void;
  onAddValue: () => void;
  onRemoveValue: (index: number) => void;

  // Actions
  onBack: () => void;
  onRegenerate: () => void;
  onProceed: () => void;
  isRegenerating: boolean;
}

export default function ReviewSection({
  decisionTitle,
  timeframe,
  importance,
  options,
  personalValues,
  emotionalContext,
  setDecisionTitle,
  setTimeframe,
  setImportance,
  setEmotionalContext,
  onOptionTextChange,
  onProChange,
  onConChange,
  onAddPro,
  onAddCon,
  onRemovePro,
  onRemoveCon,
  onAlignmentChange,
  onAddOption,
  onRemoveOption,
  onValueChange,
  onAddValue,
  onRemoveValue,
  onBack,
  onRegenerate,
  onProceed,
  isRegenerating,
}: ReviewSectionProps) {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Decision Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Decision Overview
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Decision Title</label>
            <Input
              value={decisionTitle}
              onChange={(e) => setDecisionTitle(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Timeframe</label>
              <Input
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                placeholder="When do you need to decide?"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Importance</label>
              <Input
                value={importance}
                onChange={(e) => setImportance(e.target.value)}
                placeholder="Why is this important?"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Options Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {options.map((option, idx) => (
            <div key={option.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Option {idx + 1}</Badge>
                <Input
                  value={option.text}
                  onChange={(e) => onOptionTextChange(option.id, e.target.value)}
                  className="flex-1"
                  placeholder="Describe this option"
                />
                {options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveOption(option.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pros */}
                <div className="space-y-2 bg-green-500/5 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Pros
                  </h4>
                  {option.pros.map((pro, proIdx) => (
                    <div key={proIdx} className="flex gap-2">
                      <Input
                        value={pro}
                        onChange={(e) => onProChange(option.id, proIdx, e.target.value)}
                        placeholder={`Pro ${proIdx + 1}`}
                        className="text-sm"
                      />
                      {option.pros.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => onRemovePro(option.id, proIdx)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddPro(option.id)}
                    className="text-green-600"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Pro
                  </Button>
                </div>

                {/* Cons */}
                <div className="space-y-2 bg-red-500/5 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Cons
                  </h4>
                  {option.cons.map((con, conIdx) => (
                    <div key={conIdx} className="flex gap-2">
                      <Input
                        value={con}
                        onChange={(e) => onConChange(option.id, conIdx, e.target.value)}
                        placeholder={`Con ${conIdx + 1}`}
                        className="text-sm"
                      />
                      {option.cons.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => onRemoveCon(option.id, conIdx)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddCon(option.id)}
                    className="text-red-600"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Con
                  </Button>
                </div>
              </div>

              {/* Values Alignment */}
              <div className="pt-2">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Values Alignment</span>
                  <span className="font-medium text-primary">{option.valuesAlignment}%</span>
                </div>
                <Slider
                  value={[option.valuesAlignment]}
                  onValueChange={(value) => onAlignmentChange(option.id, value)}
                  max={100}
                  step={5}
                />
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={onAddOption} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Option
          </Button>
        </CardContent>
      </Card>

      {/* Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Personal Values
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {personalValues.map((value, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={value}
                onChange={(e) => onValueChange(index, e.target.value)}
                placeholder={`Value ${index + 1}`}
              />
              {personalValues.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveValue(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={onAddValue}>
            <Plus className="h-4 w-4 mr-1" />
            Add Value
          </Button>
        </CardContent>
      </Card>

      {/* Emotional Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            Emotional Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={emotionalContext}
            onChange={(e) => setEmotionalContext(e.target.value)}
            placeholder="How are you feeling about this decision?"
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          variant="outline"
          onClick={onRegenerate}
          disabled={isRegenerating}
        >
          {isRegenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <RotateCcw className="h-4 w-4 mr-2" />
              Regenerate Analysis
            </>
          )}
        </Button>
        <Button onClick={onProceed}>
          View Results
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
