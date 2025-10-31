"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import {
  generateCssVariables,
  generateSassVariables,
  generateLessVariables,
  generateTailwindConfig,
  generateUnocssTheme,
  generateWindiCssTheme,
  generateStyledComponentsTheme,
  generateMaterialUITheme,
  generateChakraUITheme,
} from "@/lib/export-formats"

interface ExportOptionsProps {
  colors: Record<string, string[]>
  className?: string
}

export function ExportOptions({ colors, className }: ExportOptionsProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('css');
  
  const exportFormats = [
    { id: 'css', name: 'CSS Variables', generator: generateCssVariables },
    { id: 'sass', name: 'SASS Variables', generator: generateSassVariables },
    { id: 'less', name: 'LESS Variables', generator: generateLessVariables },
    { id: 'tailwind', name: 'Tailwind Config', generator: generateTailwindConfig },
    { id: 'unocss', name: 'UnoCSS Theme', generator: generateUnocssTheme },
    { id: 'windicss', name: 'WindiCSS Theme', generator: generateWindiCssTheme },
    { id: 'styled', name: 'Styled Components', generator: generateStyledComponentsTheme },
    { id: 'mui', name: 'Material UI Theme', generator: generateMaterialUITheme },
    { id: 'chakra', name: 'Chakra UI Theme', generator: generateChakraUITheme }
  ];
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = (text: string, format: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-export.${getFileExtension(format)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: `The ${format} file has been downloaded.`,
    });
  };
  
  const getFileExtension = (format: string) => {
    switch (format) {
      case '': return 'txt';
      case 'css': return 'css';
      case 'sass': return 'scss';
      case 'less': return 'less';
      case 'tailwind':
      case 'unocss':
      case 'windicss':
      case 'styled':
      case 'mui':
      case 'chakra': return 'js';
      case 'json':
      case 'yaml':
      case 'toml':
      case 'html':
        return format;
      default: 
        return format.trim().toLowerCase() || "css";
    }
  };
  
  const getExportCode = (format: string) => {
    const generator = exportFormats.find(f => f.id === format)?.generator;
    return generator ? generator(colors) : '';
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <Label>Export Format</Label>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mt-2"
        >
          <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
            {exportFormats.map((format) => (
              <TabsTrigger key={format.id} value={format.id}>
