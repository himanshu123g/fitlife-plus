// Membership discount utility functions

export const MEMBERSHIP_DISCOUNTS = {
  free: 0,
  pro: 4,
  elite: 10
};

export const getMembershipDiscount = (membershipPlan) => {
  const plan = membershipPlan?.toLowerCase() || 'free';
  return MEMBERSHIP_DISCOUNTS[plan] || 0;
};

export const calculateDiscountedPrice = (originalPrice, membershipPlan) => {
  const discountPercent = getMembershipDiscount(membershipPlan);
  const discountAmount = (originalPrice * discountPercent) / 100;
  return originalPrice - discountAmount;
};

export const calculateTotalDiscount = (subtotal, membershipPlan) => {
  const discountPercent = getMembershipDiscount(membershipPlan);
  return (subtotal * discountPercent) / 100;
};

export const getDiscountLabel = (membershipPlan) => {
  const plan = membershipPlan?.toLowerCase() || 'free';
  const discount = MEMBERSHIP_DISCOUNTS[plan];
  
  if (discount === 0) return null;
  
  const labels = {
    pro: `${discount}% OFF (Pro Member)`,
    elite: `${discount}% OFF (Elite Member)`
  };
  
  return labels[plan] || null;
};

export const getMembershipUpgradeMessage = () => {
  return 'Get 4–10% OFF with Membership';
};
