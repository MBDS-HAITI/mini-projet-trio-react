export default function SchoolLogo() {
  return (
    <svg 
      width="80" 
      height="80" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ margin: '0 auto', display: 'block' }}
    >
      {/* Graduation cap - base */}
      <path 
        d="M50 20L10 40L50 60L90 40L50 20Z" 
        fill="#667eea" 
        opacity="0.9"
      />
      
      {/* Graduation cap - 3D effect */}
      <path 
        d="M50 60L90 40V55L50 75L10 55V40L50 60Z" 
        fill="#764ba2" 
        opacity="0.8"
      />
      
      {/* Tassel - circle */}
      <circle 
        cx="75" 
        cy="35" 
        r="4" 
        fill="#fbbf24"
      />
      
      {/* Tassel - string */}
      <line 
        x1="75" 
        y1="35" 
        x2="75" 
        y2="45" 
        stroke="#fbbf24" 
        strokeWidth="2"
      />
      
      {/* Book accent at bottom */}
      <rect 
        x="35" 
        y="70" 
        width="30" 
        height="4" 
        fill="#667eea" 
        opacity="0.6"
        rx="2"
      />
      
      {/* Additional book layer for depth */}
      <rect 
        x="38" 
        y="75" 
        width="24" 
        height="3" 
        fill="#764ba2" 
        opacity="0.5"
        rx="1.5"
      />
    </svg>
  );
}