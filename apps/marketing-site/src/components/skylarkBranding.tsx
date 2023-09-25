import React from "react";

interface SkylarkLogoProps {
  className?: string;
}

export const SkylarkLogo: React.FC<SkylarkLogoProps> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    height="72"
    viewBox="0 0 84 72"
    width="84"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{`Skylark Logo`}</title>
    <rect fill="#0E1825" height="24" width="24" x="36" y="24" />
    <path
      d="M12 24C12 17.6348 14.5286 11.5303 19.0294 7.02944C23.5303 2.52856 29.6348 0 36 0H84C84 6.3652 81.4714 12.4697 76.9706 16.9706C72.4697 21.4714 66.3652 24 60 24H36C42.3652 24 48.4697 26.5286 52.9706 31.0294C57.4714 35.5303 60 41.6348 60 48H36C29.6348 48 23.5303 45.4714 19.0294 40.9706C14.5286 36.4697 12 30.3652 12 24Z"
      fill="#0E1825"
    />
    <path
      d="M60 72H0C0 65.6348 2.52856 59.5303 7.02944 55.0294C11.5303 50.5286 17.6348 48 24 48H70L60 72Z"
      fill="#0D5AF1"
    />
    <path
      d="M60 72C66.3652 72 72.4697 69.4714 76.9706 64.9706C81.4714 60.4697 84 54.3652 84 48C84 41.6348 81.4714 35.5303 76.9706 31.0294C72.4697 26.5286 66.3652 24 60 24H36C42.3652 24 48.4697 26.5286 52.9706 31.0294C57.4714 35.5303 60 41.6348 60 48V72Z"
      fill="url(#paint0_linear_1041_895)"
    />
    <path d="M60 48H36L60 72V48Z" fill="url(#paint1_linear_1041_895)" />
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint0_linear_1041_895"
        x1="60"
        x2="60"
        y1="24"
        y2="58.5"
      >
        <stop offset="0.347826" stopColor="#226DFF" />
        <stop offset="1" stopColor="#0D5AF1" />
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint1_linear_1041_895"
        x1="60"
        x2="48"
        y1="48"
        y2="60"
      >
        <stop stopOpacity="0.35" />
        <stop offset="1" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export const SkylarkLogoWithText: React.FC<SkylarkLogoProps> = ({
  className,
}) => (
  <svg
    className={className}
    fill="none"
    height="72"
    viewBox="0 0 276 72"
    width="276"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{`Skylark Logo With Text`}</title>
    <path
      d="M123.52 28.94C124.356 28.6866 125.227 28.5717 126.1 28.6C127.767 28.5783 129.418 28.9195 130.94 29.6C132.449 30.2975 133.808 31.2825 134.94 32.5L138.51 27.73C137.038 26.1614 135.239 24.9358 133.24 24.14C131.008 23.2809 128.631 22.8632 126.24 22.91C123.988 22.8543 121.748 23.2628 119.66 24.11C117.979 24.796 116.522 25.9349 115.45 27.4C114.481 28.7811 113.973 30.4331 114 32.12C113.949 33.5114 114.322 34.8854 115.07 36.06C115.831 37.1416 116.867 38.001 118.07 38.55C119.415 39.1895 120.827 39.6759 122.28 40L127.52 41.16C128.406 41.2866 129.248 41.6301 129.97 42.16C130.179 42.3559 130.344 42.5931 130.456 42.8565C130.568 43.1199 130.624 43.4038 130.62 43.69C130.628 44.2028 130.463 44.7033 130.15 45.11C129.758 45.557 129.238 45.8715 128.66 46.01C127.842 46.2285 126.997 46.3295 126.15 46.31C124.86 46.3083 123.576 46.1197 122.34 45.75C121.132 45.3954 119.975 44.8844 118.9 44.23C117.91 43.631 117.02 42.8821 116.26 42.01L112.69 46.96C113.706 48.0203 114.88 48.9176 116.17 49.62C117.629 50.4293 119.194 51.0318 120.82 51.41C122.593 51.8279 124.409 52.036 126.23 52.03C128.341 52.0673 130.44 51.7113 132.42 50.98C134.111 50.3619 135.589 49.2722 136.68 47.84C137.741 46.3556 138.286 44.5639 138.23 42.74C138.265 41.813 138.105 40.889 137.76 40.0278C137.416 39.1665 136.895 38.3871 136.23 37.74C134.434 36.2734 132.287 35.3014 130 34.92L125.22 33.84C124.249 33.6762 123.321 33.3191 122.49 32.79C122.235 32.626 122.025 32.4013 121.878 32.136C121.732 31.8707 121.653 31.5731 121.65 31.27C121.643 30.7745 121.798 30.2903 122.09 29.89C122.454 29.4299 122.955 29.0972 123.52 28.94Z"
      fill="#0E1825"
    />
    <path
      d="M158.35 51.69H166.44L158.05 38.64L165.97 30.19H157.84L149.67 39.22V21.07H142.36V51.69H149.67V46.73L153.13 42.86L158.35 51.69Z"
      fill="#0E1825"
    />
    <path
      d="M180.15 42.27L179 47L178 42.44L174.69 30.19H166.69L173 46.31L175.49 52.16L175 53.5C174.783 54.1766 174.333 54.7542 173.73 55.13C173.108 55.4348 172.422 55.5825 171.73 55.56C170.993 55.5778 170.256 55.4971 169.54 55.32C168.95 55.1592 168.394 54.8915 167.9 54.53L166.44 59.47C167.236 59.9524 168.099 60.3162 169 60.55C170.086 60.8195 171.201 60.9506 172.32 60.94C173.914 60.9785 175.498 60.6679 176.96 60.03C178.318 59.3746 179.475 58.3661 180.31 57.11C181.42 55.4265 182.305 53.6042 182.94 51.69L190.76 30.19H183.5L180.15 42.27Z"
      fill="#0E1825"
    />
    <path
      d="M202.6 47C202.307 47.0311 202.01 46.993 201.734 46.8888C201.458 46.7846 201.21 46.6172 201.01 46.4C200.643 45.8009 200.478 45.0998 200.54 44.4V21.07H193.23V45.33C193.23 47.73 193.74 49.47 194.77 50.53C195.8 51.59 197.47 52.12 199.77 52.12C200.596 52.1171 201.418 52.0164 202.22 51.82C202.923 51.6664 203.598 51.4032 204.22 51.04L204.7 46.66C204.29 46.77 203.95 46.86 203.7 46.92C203.336 46.9791 202.968 47.0059 202.6 47Z"
      fill="#0E1825"
    />
    <path
      d="M227 45.8V37.93C227.055 36.3501 226.645 34.7888 225.82 33.44C224.998 32.192 223.81 31.2281 222.42 30.68C220.714 30.0272 218.896 29.7147 217.07 29.76C213.937 29.76 211.513 30.3767 209.8 31.61C208.971 32.184 208.264 32.9158 207.718 33.7634C207.173 34.6111 206.799 35.558 206.62 36.55L212.79 38C212.918 37.012 213.419 36.1104 214.19 35.48C214.906 34.9948 215.756 34.7464 216.62 34.77C217.037 34.7513 217.454 34.8199 217.843 34.9714C218.232 35.123 218.585 35.3541 218.88 35.65C219.456 36.3086 219.754 37.1658 219.71 38.04V38.65L212.27 40.19C210.615 40.4163 209.074 41.1621 207.87 42.32C206.924 43.3746 206.422 44.7541 206.47 46.17C206.428 47.3143 206.734 48.4444 207.35 49.41C207.972 50.3125 208.85 51.0089 209.87 51.41C211.084 51.8934 212.383 52.1281 213.69 52.1C214.928 52.105 216.159 51.9022 217.33 51.5C218.421 51.1411 219.4 50.5034 220.17 49.65C220.376 49.4076 220.554 49.1425 220.7 48.86C220.813 49.214 220.974 49.5506 221.18 49.86C221.667 50.5927 222.364 51.1609 223.18 51.49C224.133 51.8702 225.154 52.0539 226.18 52.03C227.258 52.0615 228.33 51.8567 229.32 51.43L229.75 47.25C229.351 47.3832 228.931 47.4442 228.51 47.43C227.48 47.48 227 46.92 227 45.8ZM219.43 45.37C219.248 45.8052 218.971 46.1946 218.62 46.51C218.273 46.81 217.868 47.0348 217.43 47.17C216.982 47.3192 216.512 47.3935 216.04 47.39C215.458 47.4045 214.886 47.2404 214.4 46.92C214.173 46.7625 213.99 46.5491 213.869 46.3004C213.748 46.0517 213.693 45.776 213.71 45.5C213.69 45.2195 213.736 44.9383 213.846 44.6793C213.955 44.4203 214.125 44.1909 214.34 44.01C214.912 43.6191 215.565 43.3626 216.25 43.26L219.73 42.54V43.73C219.738 44.2929 219.629 44.8513 219.41 45.37H219.43Z"
      fill="#0E1825"
    />
    <path
      d="M245.9 29.76C244.415 29.7007 242.958 30.1722 241.79 31.09C240.65 32.0878 239.808 33.3825 239.36 34.83L239.06 30.19H232.61V51.69H239.92V40.85C239.882 39.8823 240.114 38.9231 240.59 38.08C241.014 37.3693 241.631 36.7936 242.37 36.42C243.119 36.0514 243.945 35.863 244.78 35.87C245.318 35.8622 245.857 35.8957 246.39 35.97C246.764 36.0296 247.133 36.1233 247.49 36.25L248.22 30.25C247.932 30.0905 247.622 29.9758 247.3 29.91C246.84 29.8082 246.371 29.7579 245.9 29.76Z"
      fill="#0E1825"
    />
    <path
      d="M267.1 51.69H275.18L266.79 38.64L274.71 30.19H266.58L258.41 39.22V21.07H251.1V51.69H258.41V46.73L261.87 42.86L267.1 51.69Z"
      fill="#0E1825"
    />
    <path
      d="M12 24C12 17.6348 14.5286 11.5303 19.0294 7.02944C23.5303 2.52856 29.6348 0 36 0H84C84 6.3652 81.4714 12.4697 76.9706 16.9706C72.4697 21.4714 66.3652 24 60 24H36C42.3652 24 48.4697 26.5286 52.9706 31.0294C57.4714 35.5303 60 41.6348 60 48H36C29.6348 48 23.5303 45.4714 19.0294 40.9706C14.5286 36.4697 12 30.3652 12 24Z"
      fill="#0E1825"
    />
    <path
      d="M60 72H0C0 65.6348 2.52856 59.5303 7.02944 55.0294C11.5303 50.5286 17.6348 48 24 48H70L60 72Z"
      fill="#0D5AF1"
    />
    <path d="M60 48H36L60 72V48Z" fill="url(#paint0_linear_1041_867)" />
    <path
      d="M60 72C66.3652 72 72.4697 69.4714 76.9706 64.9706C81.4714 60.4697 84 54.3652 84 48C84 41.6348 81.4714 35.5303 76.9706 31.0294C72.4697 26.5286 66.3652 24 60 24H36C42.3652 24 48.4697 26.5286 52.9706 31.0294C57.4714 35.5303 60 41.6348 60 48V72Z"
      fill="url(#paint1_linear_1041_867)"
    />
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint0_linear_1041_867"
        x1="60"
        x2="48"
        y1="48"
        y2="60"
      >
        <stop stopOpacity="0.35" />
        <stop offset="1" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint1_linear_1041_867"
        x1="60"
        x2="60"
        y1="24"
        y2="58.5"
      >
        <stop offset="0.347826" stopColor="#226DFF" />
        <stop offset="1" stopColor="#0D5AF1" />
      </linearGradient>
    </defs>
  </svg>
);

export const SkylarkBranding: React.FC<SkylarkLogoProps> = ({ className }) => (
  <>
    <SkylarkLogo className={`md:hidden ${className || ""}`} />
    <SkylarkLogoWithText className={`hidden md:block ${className || ""}`} />
  </>
);

export default SkylarkBranding;
