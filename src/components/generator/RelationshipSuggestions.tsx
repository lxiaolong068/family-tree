"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RelationshipSuggestion } from '@/lib/relationship-suggestions';
import { Member, Relationship, RelationType } from '@/types/family-tree';
import { Badge } from '@/components/ui/badge';
import { User, Heart, Users, UserCircle } from 'lucide-react';

interface RelationshipSuggestionsProps {
  suggestions: RelationshipSuggestion[];
  allMembers: Member[];
  onAcceptSuggestion: (suggestion: RelationshipSuggestion) => void;
  onDismissSuggestion: (suggestion: RelationshipSuggestion) => void;
}

export function RelationshipSuggestions({
  suggestions,
  allMembers,
  onAcceptSuggestion,
  onDismissSuggestion
}: RelationshipSuggestionsProps) {
  if (!suggestions.length) {
    return null;
  }

  // 获取成员名称
  const getMemberName = (id: string) => {
    const member = allMembers.find(m => m.id === id);
    return member ? member.name : 'Unknown';
  };

  // 获取关系类型图标
  const getRelationshipIcon = (type: RelationType) => {
    switch (type) {
      case RelationType.PARENT:
        return <User className="h-4 w-4 text-blue-500" />;
      case RelationType.CHILD:
        return <User className="h-4 w-4 text-green-500" />;
      case RelationType.SPOUSE:
        return <Heart className="h-4 w-4 text-red-500" />;
      case RelationType.SIBLING:
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <UserCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // 获取关系类型标签
  const getRelationshipLabel = (type: RelationType): string => {
    switch (type) {
      case RelationType.PARENT:
        return 'Parent';
      case RelationType.CHILD:
        return 'Child';
      case RelationType.SPOUSE:
        return 'Spouse';
      case RelationType.SIBLING:
        return 'Sibling';
      default:
        return 'Other';
    }
  };

  // 获取置信度标签
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) {
      return <Badge variant="default" className="bg-green-500">High</Badge>;
    } else if (confidence >= 0.5) {
      return <Badge variant="default" className="bg-yellow-500">Medium</Badge>;
    } else {
      return <Badge variant="default" className="bg-red-500">Low</Badge>;
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Suggested Relationships</CardTitle>
        <CardDescription>
          Based on existing relationships, we suggest the following connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start justify-between border-b pb-3">
              <div>
                <div className="flex items-center gap-2">
                  {getRelationshipIcon(suggestion.type)}
                  <span className="font-medium">
                    {getMemberName(suggestion.memberId)} → {getRelationshipLabel(suggestion.type)} → {getMemberName(suggestion.targetId)}
                  </span>
                  {getConfidenceBadge(suggestion.confidence)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{suggestion.reason}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDismissSuggestion(suggestion)}
                >
                  Dismiss
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => onAcceptSuggestion(suggestion)}
                >
                  Accept
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
