// js/metrics.js

function getApprovedPosts() {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  return posts.filter(p => p.approved);
}

function getMetrics() {
  const approved = getApprovedPosts();

  return {
    totalMaterials: approved.length,
    totalImpact: approved.length * 25, // kg demo
    totalUsers: new Set(approved.map(p => p.user)).size,
    totalValue: approved.reduce((sum, p) => sum + Number(p.price || 0), 0)
  };
}
