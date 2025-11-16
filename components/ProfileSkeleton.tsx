export function ProfileSkeleton() {
    return (
        <div className="animate-pulse mb-16">
            <div className="glass rounded-2xl p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Avatar Skeleton */}
                    <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gray-700/50"></div>
                    
                    {/* Content Skeleton */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="h-12 bg-gray-700/50 rounded-lg mb-2 max-w-md"></div>
                        <div className="h-6 bg-gray-700/50 rounded-lg mb-4 max-w-sm"></div>
                        <div className="h-20 bg-gray-700/50 rounded-lg mb-6 max-w-2xl"></div>
                        
                        {/* Buttons Skeleton */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                            <div className="h-10 w-24 bg-gray-700/50 rounded-xl"></div>
                            <div className="h-10 w-28 bg-gray-700/50 rounded-xl"></div>
                            <div className="h-10 w-32 bg-gray-700/50 rounded-xl"></div>
                        </div>
                    </div>
                </div>
                
                {/* Skills Skeleton */}
                <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="h-6 bg-gray-700/50 rounded-lg mb-4 max-w-xs"></div>
                    <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-6 w-16 bg-gray-700/50 rounded-full"></div>
                        ))}
                    </div>
                </div>
                
                {/* Social Media Skeleton */}
                <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="h-6 bg-gray-700/50 rounded-lg mb-4 max-w-xs"></div>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-10 w-20 bg-gray-700/50 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}