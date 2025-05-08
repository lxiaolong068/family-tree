"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Member } from '@/types/family-tree';
import { UserPlus, BarChart2, Save, Calendar, Users, CircleUser, UserCircle } from 'lucide-react';

interface MemberFormProps {
  currentMember: Partial<Member>;
  onInputChange: (field: keyof Member, value: string) => void;
  onAddMember: () => void;
  onGenerateChart: () => void;
  onSaveToDatabase: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({
  currentMember,
  onInputChange,
  onAddMember,
  onGenerateChart,
  onSaveToDatabase
}) => {
  return (
    <Card className="mb-8 shadow-md">
      <CardHeader className="bg-muted/50 rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-xl">
          <UserPlus className="h-5 w-5 text-primary" />
          Add Family Member
        </CardTitle>
        <CardDescription>
          Fill in the basic information for the family member. You can add complex relationships after adding the member.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="basic" aria-controls="basic-tab-content">Basic Info</TabsTrigger>
            <TabsTrigger value="additional" aria-controls="additional-tab-content">Additional Info</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" id="basic-tab-content" role="tabpanel" aria-labelledby="basic-tab-trigger">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter name"
                    value={currentMember.name || ''}
                    onChange={(e) => onInputChange('name', e.target.value)}
                    className="focus-visible:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relation" className="text-sm font-medium">
                    Relationship <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="relation"
                    placeholder="e.g. father, mother, son"
                    value={currentMember.relation || ''}
                    onChange={(e) => onInputChange('relation', e.target.value)}
                    className="focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium">
                    Gender
                  </Label>
                  <RadioGroup
                    value={currentMember.gender || 'male'}
                    onValueChange={(value) => onInputChange('gender', value)}
                    className="flex flex-col space-y-1 mt-2"
                  >
                    <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="male" id="gender-male" />
                      <Label htmlFor="gender-male" className="flex items-center gap-2 cursor-pointer">
                        <UserCircle className="h-4 w-4 text-blue-500" />
                        <span>Male</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="female" id="gender-female" />
                      <Label htmlFor="gender-female" className="flex items-center gap-2 cursor-pointer">
                        <CircleUser className="h-4 w-4 text-pink-500" />
                        <span>Female</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="other" id="gender-other" />
                      <Label htmlFor="gender-other" className="flex items-center gap-2 cursor-pointer">
                        <Users className="h-4 w-4 text-green-500" />
                        <span>Other</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Birth Date
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={currentMember.birthDate || ''}
                    onChange={(e) => onInputChange('birthDate', e.target.value)}
                    className="focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="additional" id="additional-tab-content" role="tabpanel" aria-labelledby="additional-tab-trigger">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deathDate" className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Death Date
                  </Label>
                  <Input
                    id="deathDate"
                    type="date"
                    value={currentMember.deathDate || ''}
                    onChange={(e) => onInputChange('deathDate', e.target.value)}
                    className="focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthPlace" className="text-sm font-medium">
                    Birth Place
                  </Label>
                  <Input
                    id="birthPlace"
                    placeholder="City, Country"
                    value={currentMember.birthPlace || ''}
                    onChange={(e) => onInputChange('birthPlace', e.target.value)}
                    className="focus-visible:ring-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Additional information about this person"
                  value={currentMember.description || ''}
                  onChange={(e) => onInputChange('description', e.target.value)}
                  className="min-h-[100px] focus-visible:ring-primary"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0 bg-muted/30 rounded-b-xl py-4">
        <Button
          onClick={onAddMember}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
        <div className="flex-1 sm:flex-none"></div>
        <Button
          variant="outline"
          onClick={onGenerateChart}
          className="w-full sm:w-auto border-primary/50 text-primary hover:bg-primary/10 hover:text-primary gap-2"
        >
          <BarChart2 className="h-4 w-4" />
          Generate Chart
        </Button>
        <Button
          variant="secondary"
          onClick={onSaveToDatabase}
          className="w-full sm:w-auto gap-2"
        >
          <Save className="h-4 w-4" />
          Save to Database
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MemberForm;
