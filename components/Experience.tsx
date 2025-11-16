'use client';

import React from 'react';
import { easeOut, motion } from 'framer-motion';

interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  technologies: string[];
  type: 'work' | 'education' | 'project';
}

interface ExperienceProps {
  experiences: ExperienceItem[];
}

export function Experience({ experiences }: ExperienceProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: easeOut
      }
    }
  };

  return (
    <section className="mb-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-12 bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          Experience Timeline
        </motion.h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-purple-400 via-pink-400 to-blue-400 transform md:-translate-x-1/2"></div>

          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              variants={itemVariants}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <motion.div
                className="absolute left-8 md:left-1/2 w-4 h-4 bg-linear-to-r from-purple-400 to-pink-400 rounded-full transform md:-translate-x-1/2 z-10"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />

              {/* Content card */}
              <motion.div
                className={`glass rounded-2xl p-6 ml-16 md:ml-0 md:w-5/12 ${
                  index % 2 === 0 ? 'md:mr-auto md:ml-0' : 'md:ml-auto md:mr-0'
                } soft-shadow hover:shadow-xl transition-all duration-300`}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    experience.type === 'work' 
                      ? 'bg-green-500/20 text-green-300' 
                      : experience.type === 'education'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {experience.type.toUpperCase()}
                  </div>
                  <span className="text-sm text-white/60">{experience.duration}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{experience.position}</h3>
                <h4 className="text-lg text-purple-300 mb-3">{experience.company}</h4>
                <p className="text-white/80 mb-4 leading-relaxed">{experience.description}</p>

                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech, techIndex) => (
                    <motion.span
                      key={techIndex}
                      className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm border border-white/20"
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: "rgba(255,255,255,0.2)" 
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}