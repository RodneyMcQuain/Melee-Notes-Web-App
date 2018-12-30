using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace melee_notes.Models
{
    public partial class MeleeNotesContext : DbContext
    {
        public MeleeNotesContext()
        {
        }

        public MeleeNotesContext(DbContextOptions<MeleeNotesContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Game> Games { get; set; }
        public virtual DbSet<Player> Players { get; set; }
        public virtual DbSet<Set> Sets { get; set; }
        public virtual DbSet<Tournament> Tournaments { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("DefaultConnection");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.0-rtm-35687");

            modelBuilder.Entity<Game>(entity =>
            {
                entity.Property(e => e.MyCharacter).IsRequired();

                entity.Property(e => e.OpponentCharacter).IsRequired();

                entity.Property(e => e.Outcome).IsRequired();

                entity.Property(e => e.Stage).IsRequired();

                entity.HasOne(d => d.Set)
                    .WithMany(p => p.Games)
                    .HasForeignKey(d => d.SetId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("SetId");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Games)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("UserId");
            });

            modelBuilder.Entity<Player>(entity =>
            {
                entity.Property(e => e.Tag).IsRequired();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Players)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("UserId");
            });

            modelBuilder.Entity<Set>(entity =>
            {
                entity.Property(e => e.Outcome).IsRequired();

                entity.HasOne(d => d.Player)
                    .WithMany(p => p.Sets)
                    .HasForeignKey(d => d.PlayerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("PlayerId");

                entity.HasOne(d => d.Tournament)
                    .WithMany(p => p.Sets)
                    .HasForeignKey(d => d.TournamentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TournamentId");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Sets)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("UserId");
            });

            modelBuilder.Entity<Tournament>(entity =>
            {
                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.Name).IsRequired();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Tournaments)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("UserId");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("date");

                entity.Property(e => e.Email).IsRequired();

                entity.Property(e => e.Password).IsRequired();

                entity.Property(e => e.Username).IsRequired();
            });

            modelBuilder.HasSequence("Players_Id_seq");

            modelBuilder.HasSequence("Users_Id_seq");
        }
    }
}
