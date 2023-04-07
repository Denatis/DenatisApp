using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DenatisApp.Models
{
    [Table("User")]
    public partial class User
    {
        [Key]
        [Column("idUser")]
        public int IdUser { get; set; }
        [Column("username")]
        [StringLength(50)]
        public string? Username { get; set; }
        [Column("password")]
        [StringLength(50)]
        public string? Password { get; set; }
    }
}
