using System;
using System.Net;
using System.Windows.Forms;

namespace Tool
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if(new WebClient().DownloadString("http://localhost/isValid?pin=" + textBox1.Text) == "valid") {
                new Scan(textBox1.Text).Show();
                this.Hide();
            } else
            {
                MessageBox.Show("invalid pin");
            }
        }
    }
}
