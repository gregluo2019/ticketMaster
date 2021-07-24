using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Forum.Data.Models;
using Forum.Data.Models.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Forum.Data
{
    public class ForumContext : IdentityDbContext<User>
    { 
        public ForumContext(DbContextOptions<ForumContext> options)
            : base(options)
        {
        }

        public override int SaveChanges()
        {
            AddTimestamps();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            AddTimestamps();
            return (await base.SaveChangesAsync(true, cancellationToken));
        }


        private void AddTimestamps()
        {
            var entities = ChangeTracker.Entries().Where(x => x.Entity is BaseEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            foreach (var entity in entities)
            {

                ((BaseEntity)entity.Entity).DateModified = DateTime.UtcNow;
            }
        }

        public DbSet<LoginInfo> LoginInfo { get; set; }

        public DbSet<Post> Posts { get; set; }

        public DbSet<Comment> Comments { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<ContactUs> ContactUs { get; set; }

        public DbSet<EventLog> Logs { get; set; }

        public DbSet<Job> Jobs { get; set; }
        public DbSet<JobUser> JobUsers { get; set; }

        public DbSet<Panel> Panels { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);



            builder
                .Entity<User>()
                .Property(u => u.IsActive)
                .HasDefaultValue(true);
            builder
                .Entity<User>()
                .Property(u => u.IsLogged)
                .HasDefaultValue(false);



        }
    }
}
