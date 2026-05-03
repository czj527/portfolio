'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ScheduleView } from '@/components/schedule/ScheduleView';

export default function SchedulePage() {
  return (
    <div className="min-h-screen pt-16 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">返回首页</span>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            我的日程
          </h1>
          <p className="text-muted-foreground">
            本周日程安排 · 支持对话添加
          </p>
        </motion.div>
        
        {/* Schedule View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-border/50"
        >
          <ScheduleView ownerId="czj527" showLegend={true} />
        </motion.div>
        
        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 rounded-xl bg-muted/30 border border-border/30"
        >
          <h3 className="font-medium mb-2 flex items-center gap-2">
            💡 提示
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 在对话中输入「帮我添加一个明天上午9点的会议」即可快速添加日程</li>
            <li>• 日程支持课程、工作、个人、会议四种类型</li>
            <li>• 可以设置提醒时间，重要日程不会错过</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
