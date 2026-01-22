import React from "react"
import { Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingProgressStepsProps {
  currentStep: number
}

export const BookingProgressSteps: React.FC<BookingProgressStepsProps> = ({
  currentStep,
}) => {
  const steps = [
    { id: 1, label: "Аялагчийн мэдээлэл" },
    { id: 2, label: "Төлбөр төлөх" }
  ];

  return (
    /* mt-12 буюу margin-top нэмж дээрээс нь зай авлаа */
    <div className="w-full max-w-2xl mx-auto mt-20 mb-16 px-4">
      <div className="relative flex items-center justify-between">
        
        {/* Background Line - Суурь саарал шугам */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-100 -z-10 rounded-full" />
        
        {/* Active Progress Line - Ногоон дүүргэгч шугам */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-purple-500 transition-all duration-700 ease-in-out -z-10 rounded-full"
          style={{ width: currentStep > 1 ? "100%" : "0%" }}
        />

        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative">
                {/* Дугуй дүрс болон дугаар */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border-[3px]",
                    isActive 
                      ? "bg-white border-purple-500 text-purple-600 scale-110 shadow-lg shadow-purple-100" 
                      : isCompleted 
                        ? "bg-purple-500 border-purple-500 text-white" 
                        : "bg-white border-gray-100 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 stroke-[3] animate-in zoom-in duration-300" />
                  ) : (
                    <span className="text-lg font-black">{step.id}</span>
                  )}
                </div>
                
                {/* Текст мэдээлэл */}
                <div className="absolute -bottom-10 whitespace-nowrap text-center">
                  <span className={cn(
                    "text-[12px] font-black uppercase tracking-widest transition-colors duration-300",
                    isActive || isCompleted ? "text-gray-900" : "text-gray-400"
                  )}>
                    {step.label}
                  </span>
                </div>
              </div>

              {/* Алхмуудын хоорондох сум */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 flex justify-center transition-colors duration-500 px-4",
                  isCompleted ? "text-purple-500" : "text-gray-200"
                )}>
                  <ChevronRight className={cn("w-5 h-5", isCompleted && "animate-pulse")} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  )
}